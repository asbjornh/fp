import test from "ava";

import { get } from "../source/index";

test("Single path", t => {
  const a = { a: 1 };
  const b = [1, 2];
  const c = [[1, 2]];

  t.is(1, get("a")(a));
  t.is(2, get("[1]")(b));
  t.is(2, get("[1]")(get("[0]")(c)));
  t.is(undefined, get("a")());
  t.is("b", get("a", "b")());
  t.deepEqual({}, get("a.b.c", {})());
});

test("Deep path", t => {
  const a = { a: { b: 1 } };
  const b = [1, [2, [3]]];
  const c = { a: [1, 2] };

  t.is(1, get("a.b")(a));
  t.is(3, get("[1][1][0]")(b));
  t.is(2, get("a[1]")(c));
});
