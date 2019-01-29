import test from "ava";

import {
  add,
  divide,
  multiply,
  subtract,
  max,
  min,
  clamp,
  pow,
  rangeMap
} from "../source/index";

const macro = (t, expected, input) => {
  t.is(expected, input);
};

test("add", macro, 2, add(1)(1));
test("divide", macro, 5, divide(2)(10));
test("multiply", macro, 10, multiply(2)(5));
test("subtract", macro, 2, subtract(4)(6));

test("max", macro, 2, max([1, 2, 0]));
test("min", macro, 0, min([1, 2, 0]));
test("clamp upper", macro, 2, clamp(0, 2)(4));
test("clamp lower", macro, 0, clamp(0, 2)(-4));
test("pow", macro, 100, pow(2)(10));
test("rangeMap", macro, 15, rangeMap(0, 1, 10, 20)(0.5));
