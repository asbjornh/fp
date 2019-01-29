import test from "ava";

import { int, float, toFixed } from "../source/index";

const macro = (t, expected, input) => {
  t.is(expected, input);
};

test("int", macro, 1, int("1"));
test("float", macro, 1.5, float("1.5"));
test("toFixed", macro, "1.50", toFixed(2)(1.500001));
test("toFixed: empty", macro, undefined, toFixed(2)());
