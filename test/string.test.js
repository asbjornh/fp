import test from "ava";

import {
  charCodeAt,
  endsWith,
  fromCharCode,
  padEnd,
  padStart,
  repeat,
  replace,
  split,
  startsWith,
  substring,
  toLowerCase,
  toUpperCase,
  trim
} from "../index";

const macro = (t, expected, input) => {
  t.deepEqual(expected, input);
};

test("charCodeAt", macro, 65, charCodeAt(0)("ABC"));
test("charCodeAt: empty", macro, NaN, charCodeAt(0)());
test("endsWith: true", macro, true, endsWith("C")("ABC"));
test("endsWith: false", macro, false, endsWith("A")("ABC"));
test("endsWith: empty", macro, false, endsWith("A")());
// Should ignore extra arguments:
test("fromCharCode", macro, "A", fromCharCode(65, false, false));
test("padEnd", macro, "A__", padEnd(3, "_")("A"));
test("padEnd: empty", macro, "___", padEnd(3, "_")());
test("padStart", macro, "__A", padStart(3, "_")("A"));
test("padStart: empty", macro, "___", padStart(3, "_")());
test("repeat", macro, "AAA", repeat(3)("A"));
test("repeat: empty", macro, "", repeat(3)());
test("replace", macro, "ABC", replace("x", "B")("AxC"));
test("replace: empty", macro, "", replace("x", "B")());
test("split", macro, ["A", "B", "C"], split("")("ABC"));
test("split: empty", macro, [], split("")());
test("startsWith: true", macro, true, startsWith("A")("ABC"));
test("startsWith: false", macro, false, startsWith("C")("ABC"));
test("startsWith: empty", macro, false, startsWith("C")());
test("substring", macro, "B", substring(1, 2)("ABC"));
test("substring: empty", macro, "", substring(1, 2)());
test("toLowerCase", macro, "abc", toLowerCase("ABC"));
test("toLowerCase: empty", macro, "", toLowerCase());
test("toUpperCase", macro, "ABC", toUpperCase("abc"));
test("toUpperCase: empty", macro, "", toUpperCase());
test("trim", macro, "ABC", trim("   ABC    "));
test("trim: empty", macro, "", trim());
