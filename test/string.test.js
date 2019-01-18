import test from "ava";

import {
  charCodeAt,
  endsWith,
  fromCharCode,
  match,
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
test("endsWith: true", macro, true, endsWith("C")("ABC"));
test("endsWith: false", macro, false, endsWith("A")("ABC"));
// Should ignore extra arguments:
test("fromCharCode", macro, "A", fromCharCode(65, false, false));
test("match", macro, ["A", "C"], match(/[A-Z]/g)("AbC"));
test("padEnd", macro, "A__", padEnd(3)("_")("A"));
test("padStart", macro, "__A", padStart(3)("_")("A"));
test("repeat", macro, "AAA", repeat(3)("A"));
test("replace", macro, "ABC", replace("x")("B")("AxC"));
test("split", macro, ["A", "B", "C"], split("")("ABC"));
test("startsWith: true", macro, true, startsWith("A")("ABC"));
test("startsWith: false", macro, false, startsWith("C")("ABC"));
test("substring", macro, "B", substring(1)(2)("ABC"));
test("toLowerCase", macro, "abc", toLowerCase("ABC"));
test("toUpperCase", macro, "ABC", toUpperCase("abc"));
test("trim", macro, "ABC", trim("   ABC    "));
