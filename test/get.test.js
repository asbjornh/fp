import test from "ava";

import { get } from "../index";

test("Single path", t => {
  const a = { a: 1 };
  const b = [1, 2];
  const c = [[1, 2]];

  t.is(1, get("a")(a));
  t.is(2, get(1)(b));
  t.is(2, get(1)(get(0)(c)));
  t.is(undefined, get("a")());
});

test("Deep path", t => {
  const a = { a: { b: 1 } };
  const b = [1, [2, [3]]];

  t.is(1, get(["a", "b"])(a));
  t.is(3, get([1, 1, 0])(b));
});
