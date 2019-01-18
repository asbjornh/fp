import test from "ava";

import { assign } from "../index";

test("assign", t => {
  const a = { a: 1, b: 2 };
  const b = { b: "b" };

  t.deepEqual({ a: 1, b: "b" }, assign(b)(a));
  t.deepEqual({ a: 1, b: 2 }, assign(a)(b));
  // Should not mutate:
  t.not(a, assign(b)(a));
});
