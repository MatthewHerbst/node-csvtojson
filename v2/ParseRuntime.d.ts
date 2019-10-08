/// <reference types="node" />
import CSVError from "./CSVError";
import { Converter, PreRawDataCallback, PreFileLineCallback } from "./Converter";
import { CellParser } from "./Parameters";
export interface ParseRuntime {
    /**
     * If need convert ignoreColumn from column name(string) to column index (number). Parser needs column index.
     */
    needProcessIgnoreColumn: boolean;
    /**
     * If need convert includeColumn from column name(string) to column index (number). Parser needs column index.
     */
    needProcessIncludeColumn: boolean;
    /**
     * The indexes of columns to reserve, undefined means reserve all, [] means hide all
     */
    selectedColumns?: number[];
    ended: boolean;
    hasError: boolean;
    error?: Error;
    /**
     * Inferred delimiter
     */
    delimiter: string | string[];
    /**
     * Inferred eol
     */
    eol?: string;
    /**
     * Converter function for a column. Populated at runtime.
     */
    columnConv: (CellParser | null)[];
    headerType: any[];
    headerTitle: string[];
    headerFlag: any[];
    /**
     * Inferred headers
     */
    headers?: any[];
    csvLineBuffer?: Buffer;
    /**
     * After first chunk of data being processed and emitted, started will become true.
     */
    started: boolean;
    preRawDataHook?: PreRawDataCallback;
    preFileLineHook?: PreFileLineCallback;
    parsedLineNumber: number;
    columnValueSetter: Function[];
    subscribe?: {
        onNext?: (data: any, lineNumber: number) => void | Promise<void>;
        onError?: (err: CSVError) => void;
        onCompleted?: () => void;
    };
    then?: {
        onfulfilled: (value: any) => any;
        onrejected: (err: Error) => any;
    };
}
export declare function initParseRuntime(converter: Converter): ParseRuntime;
