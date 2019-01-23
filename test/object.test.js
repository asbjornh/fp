import test from "ava";

import { assign, get } from "../index";

test("assign", t => {
  const a = { a: 1, b: 2 };
  const b = { b: "b" };

  t.deepEqual({ a: 1, b: "b" }, assign(b)(a));
  t.deepEqual({ a: 1, b: 2 }, assign(a)(b));
  // Should not mutate:
  t.not(a, assign(b)(a));
});

test("get", t => {
  const a = { a: 1 };
  const b = [1, 2];
  const c = [[1, 2]];

  t.is(1, get("a")(a));
  t.is(2, get(1)(b));
  t.is(2, get(1)(get(0)(c)));
  t.is(undefined, get("a")());
});
