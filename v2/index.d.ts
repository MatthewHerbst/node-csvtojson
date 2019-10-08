/// <reference types="node" />
import { TransformOptions } from "stream";
import { Converter } from "./Converter";
import { CSVParseParam } from "./Parameters";
declare const helper: (param?: Partial<CSVParseParam> | undefined, options?: TransformOptions | undefined) => Converter;
export = helper;
