import getEol from "./getEol";
import { ParseRuntime } from "./ParseRuntime";

/**
 * Convert data chunk to file lines array
 * @param  {string} data  data chunk as utf8 string
 * @param  {object} param Converter param object
 * @return {Object} {lines:[line1,line2...],partial:String}
 */
export function stringToLines(data: string, param: ParseRuntime): StringToLinesResult {
  const eol = getEol(data, param);
  const lines = data.split(eol);
  const partial = lines.pop() || "";
  return { lines: lines, partial: partial };
};

export interface StringToLinesResult {
  lines: Fileline[],
  /**
   * Last line which could be incomplete line.
   */
  partial: string
}
export type Fileline = string;
