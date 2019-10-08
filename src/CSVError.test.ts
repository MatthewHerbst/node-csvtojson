import assert from "assert";

import { Converter } from './Converter';

describe("CSVError", () => {
  it ("should toString()", () => {
    const conv = new Converter();
    assert.equal(conv.toString(), '[object Converter]');
  });
});
