import { TransformOptions } from "stream";

import { Converter } from "./Converter";
import { CSVParseParam } from "./Parameters";

const helper = function (param?: Partial<CSVParseParam>, options?: TransformOptions): Converter {
  return new Converter(param, options);
}
helper["csv"] = helper;
helper["Converter"] = Converter;
export = helper;
