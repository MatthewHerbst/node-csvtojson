import assert from "assert";

import { Converter } from "./Converter";
import {stringToLines} from "./fileline";

describe("fileline function", function() {
  it ("should convert data to multiple lines ", function() {
    const conv = new Converter();
    var data = "abcde\nefef";
    var result = stringToLines(data, conv.parseRuntime);
    assert.equal(result.lines.length, 1);
    assert.equal(result.partial, "efef");
    assert.equal(result.lines[0], "abcde");
  });
});
