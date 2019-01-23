import test from "ava";

import { int, float, isEven, isOdd, toFixed } from "../index";

const macro = (t, expected, input) => {
  t.is(expected, input);
};

test("int", macro, 1, int("1"));
test("float", macro, 1.5, float("1.5"));
test("isEven: true", macro, true, isEven(2));
test("isEven: false", macro, false, isEven(3));
test("isOdd: true", macro, true, isOdd(3));
test("isOdd: false", macro, false, isOdd(2));
test("toFixed", macro, "1.50", toFixed(2)(1.500001));
test("toFixed: empty", macro, undefined, toFixed(2)());
