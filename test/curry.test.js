import test from "ava";

import { curry } from "../index";

test("Returns function", t => {
  const f = curry((a, b, c) => a + b + c);

  t.is("function", typeof f(1));
  t.is("function", typeof f(1)(2));
  t.is("function", typeof f(1, 2));
});

test("Resolves when all arguments are passed", t => {
  const f = curry((a, b, c) => a + b + c);

  t.is(6, f(1, 2, 3));
  t.is(6, f(1, 2)(3));
  t.is(6, f(1)(2, 3));
});

test("With undefined", t => {
  const f = curry((a, b) => a + b);
  const u = undefined;

  t.is(NaN, f(u, u));
});

test("Without arguments", t => {
  const f = curry(a => a);
  const f2 = curry((a, b) => a + b);
  const f3 = curry((a, b, c) => a + b + c);
  const f4 = curry((a, b, c, d) => a + b + c + d);
  const f5 = curry((a, b, c, d, e) => a + b + c + d + e);

  // Should evaluate when consecutively calling with empty arguments
  t.is(undefined, f());
  t.is(NaN, f2()());
  t.is(NaN, f3()()());
  t.is(NaN, f4()()()());
  t.is(NaN, f5()()()()());

  // Should return a function of n-1 arity when calling without arguments
  t.is("function", typeof f2());
  t.is("function", typeof f3()());
  t.is("function", typeof f4()()());
  t.is("function", typeof f5()()()());
});
