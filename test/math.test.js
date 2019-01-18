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
  random,
  rangeMap,
  sum,
  radians,
  cos,
  sin,
  tan
} from "../index";

const macro = (t, expected, input) => {
  t.is(expected, input);
};

test("add", macro, 2, add(1)(1));
test("divide", macro, 5, divide(2)(10));
test("multiply", macro, 10, multiply(2)(5));
test("subtract", macro, 2, subtract(4)(6));

test("max", macro, 2, max([1, 2, 0]));
test("min", macro, 0, min([1, 2, 0]));
test("clamp upper", macro, 2, clamp(0)(2)(4));
test("clamp lower", macro, 0, clamp(0)(2)(-4));
test("pow", macro, 100, pow(2)(10));
test("random", macro, "number", typeof random(1)());
test("rangeMap", macro, 15, rangeMap(0)(1)(10)(20)(0.5));
test("sum", macro, 3, sum([0, 1, 2]));

test("radians", macro, Math.PI, radians(180));
test("sin: 0", macro, 0, sin(0));
test("sin: 90", macro, 1, sin(90));
test("cos: 0", macro, 1, cos(0));
test("cos: 90", macro, 0, Math.round(cos(90)));
test("tan: 0", macro, 0, tan(0));
// Magic number because of some weird rounding:
test("tan: 90", macro, 16331239353195370, tan(90));
