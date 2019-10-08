/// <reference types="node" />
import { Transform, TransformOptions, Readable } from "stream";
import CSVError from "./CSVError";
import { CSVParseParam } from "./Parameters";
import { ParseRuntime } from "./ParseRuntime";
export declare class Converter extends Transform implements Promise<any> {
    options: TransformOptions;
    [Symbol.toStringTag]: any;
    preRawData(onRawData: PreRawDataCallback): Converter;
    preFileLine(onFileLine: PreFileLineCallback): Converter;
    subscribe(onNext?: (data: any, lineNumber: number) => void | Promise<void>, onError?: (err: CSVError) => void, onCompleted?: () => void): Converter;
    fromFile(filePath: string, options?: string | CreateReadStreamOption | undefined): Converter;
    fromStream(readStream: Readable): Converter;
    fromString(csvString: string): Converter;
    catch<TResult1 = Promise<any>>(onrejected?: (reason: any) => TResult1 | Promise<TResult1>): Promise<TResult1>;
    then<TResult1 = any, TResult2 = never>(onfulfilled?: (value: any) => TResult1 | Promise<TResult1>, onrejected?: (reason: any) => TResult2 | Promise<TResult2>): Promise<TResult1 | TResult2>;
    readonly parseParam: CSVParseParam;
    readonly parseRuntime: ParseRuntime;
    private params;
    private runtime;
    private processor;
    private result;
    constructor(param?: Partial<CSVParseParam>, options?: TransformOptions);
    _transform(chunk: any, encoding: string, cb: Function): void;
    _flush(cb: Function): void;
    private processEnd(cb);
    readonly parsedLineNumber: number;
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
export declare type CallBack = (err: Error, data: Array<any>) => void;
export declare type PreFileLineCallback = (line: string, lineNumber: number) => string | Promise<string>;
export declare type PreRawDataCallback = (csvString: string) => string | Promise<string>;
