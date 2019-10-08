import assert from "assert";
import {readFileSync} from "fs";
import path from "path";

import { Converter } from "./Converter";
import {Result} from "./Result";

const dataDir = path.join(__dirname,"../test/data/");

describe("Result", () => {
  it ("should return need push downstream based on needEmitAll parameter", function () {
      const conv = new Converter();
      const res = new Result(conv);
      assert.equal(res["needEmitAll"], false);
      conv.then();
      assert.equal(res["needEmitAll"], true);
      conv.parseParam.needEmitAll = false;
      assert.equal(res["needEmitAll"], false);
  });
});

