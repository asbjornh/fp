import test from "ava";

import { isEven, isString, not } from "../source/index";

test("Unary", t => {
  t.is(false, isEven(1));
  t.is(true, not(isEven)(1));
  t.is(true, not(isString)(1));
});

test("Variadic", t => {
  const isEqual = (a, b) => a === b;
  const isDifferent = not(isEqual);

  t.is(true, isDifferent("a", "b"));
  t.is(false, isDifferent("a", "a"));
});
