import { Transform, TransformOptions, Readable } from "stream";

import CSVError from "./CSVError";
import { CSVParseParam, mergeParams } from "./Parameters";
import { ParseRuntime, initParseRuntime } from "./ParseRuntime";
import { Processor } from "./Processor";
import { ProcessorLocal } from "./ProcessorLocal";
import { Result } from "./Result";

export class Converter extends Transform implements Promise<any> {
  get [Symbol.toStringTag]() {
    return 'Converter';
  }
  preRawData(onRawData: PreRawDataCallback): Converter {
    this.runtime.preRawDataHook = onRawData;
    return this;
  }
  preFileLine(onFileLine: PreFileLineCallback): Converter {
    this.runtime.preFileLineHook = onFileLine;
    return this;
  }
  subscribe(
    onNext?: (data: any, lineNumber: number) => void | Promise<void>,
    onError?: (err: CSVError) => void,
    onCompleted?: () => void
  ): Converter {
    this.parseRuntime.subscribe = {
      onNext,
      onError,
      onCompleted
    };
    return this;
  }
  fromFile(filePath: string, options?: string | CreateReadStreamOption | undefined): Converter {
    const fs = require("fs");
    // var rs = null;
    // this.wrapCallback(cb, function () {
    //   if (rs && rs.destroy) {
    //     rs.destroy();
    //   }
    // });
    fs.exists(filePath, (exist) => {
      if (exist) {
        const rs = fs.createReadStream(filePath, options);
        rs.pipe(this);
      } else {
        this.emit('error', new Error("File does not exist. Check to make sure the file path to your csv is correct."));
      }
    });
    return this;
  }
  fromStream(readStream: Readable): Converter {
    readStream.pipe(this);
    return this;
  }
  fromString(csvString: string): Converter {
    const csv = csvString.toString();
    const read = new Readable();
    let idx = 0;
    read._read = function (size) {
      if (idx >= csvString.length) {
        this.push(null);
      } else {
        const str = csvString.substr(idx, size);
        this.push(str);
        idx += size;
      }
    }
    return this.fromStream(read);
  }
  catch<TResult1 = Promise<any>>(onrejected?: (reason: any) => TResult1 | Promise<TResult1>): Promise<TResult1> {
    return this.then(undefined, onrejected);
  }
  then<TResult1 = any, TResult2 = never>(onfulfilled?: (value: any) => TResult1 | Promise<TResult1>, onrejected?: (reason: any) => TResult2 | Promise<TResult2>): Promise<TResult1 | TResult2> {
    return new Promise((resolve, reject) => {
      this.parseRuntime.then = {
        onfulfilled: (value: any) => {
          if (onfulfilled) {
            resolve(onfulfilled(value));
          } else {
            resolve(value as any);
          }
        },
        onrejected: (err: Error) => {
          if (onrejected) {
            resolve(onrejected(err));
          } else {
            reject(err);
          }
        }
      }
    });
  }
  public get parseParam(): CSVParseParam {
    return this.params;
  }
  public get parseRuntime(): ParseRuntime {
    return this.runtime;
  }
  private params: CSVParseParam;
  private runtime: ParseRuntime;
  private processor: Processor;
  private result: Result;
  constructor(param?: Partial<CSVParseParam>, public options: TransformOptions = {}) {
    super(options);
    this.params = mergeParams(param);
    this.runtime = initParseRuntime(this);
    this.result = new Result(this);

    this.processor = new ProcessorLocal(this);

    this.once("error", (err: any) => {
      // Wait for next cycle to emit the errors.
      setImmediate(() => {
        this.result.processError(err);
        this.emit("done", err);
      });

    });
    this.once("done", () => {
      this.processor.destroy();
    })

    return this;
  }
  _transform(chunk: any, encoding: string, cb: Function) {
    this.processor.process(chunk)
      .then((result) => {
        if (result.length > 0) {
          this.runtime.started = true;

          return this.result.processResult(result);
        }
      })
      .then(
        () => {
          this.emit("drained");
          cb();
        },
        (error) => {
          this.runtime.hasError = true;
          this.runtime.error = error;
          this.emit("error", error);
          cb();
        }
      );
  }
  _flush(cb: Function) {
    this.processor.flush()
      .then((data) => {
        if (data.length > 0) {

          return this.result.processResult(data);
        }
      })
      .then(
        () => {
          this.processEnd(cb);
        },
        (err) => {
          this.emit("error", err);
          cb();
        }
      );
  }
  private processEnd(cb) {
    this.result.endProcess();
    this.emit("done");
    cb();
  }
  get parsedLineNumber(): number {
    return this.runtime.parsedLineNumber;
  }
}
export interface CreateReadStreamOption {
  flags?: string;
  encoding?: string;
  fd?: number;
  mode?: number;
  autoClose?: boolean;
  start?: number;
  end?: number;
  highWaterMark?: number;
}
export type CallBack = (err: Error, data: Array<any>) => void;

export type PreFileLineCallback = (line: string, lineNumber: number) => string | Promise<string>;
export type PreRawDataCallback = (csvString: string) => string | Promise<string>;
