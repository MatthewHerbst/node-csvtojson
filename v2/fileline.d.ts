import { ParseRuntime } from "./ParseRuntime";
/**
 * Convert data chunk to file lines array
 * @param  {string} data  data chunk as utf8 string
 * @param  {object} param Converter param object
 * @return {Object} {lines:[line1,line2...],partial:String}
 */
export declare function stringToLines(data: string, param: ParseRuntime): StringToLinesResult;
export interface StringToLinesResult {
    lines: Fileline[];
    /**
     * Last line which could be incomplete line.
     */
    partial: string;
}
export declare type Fileline = string;
