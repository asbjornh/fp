import test from "ava";

import { assign, has, mapEntry, mapObject, objectFromEntry } from "../source/index";

test("assign", t => {
  const a = { a: 1, b: 2 };
  const b = { b: "b" };

  t.deepEqual({ a: 1, b: "b" }, assign(b)(a));
  t.deepEqual({ a: 1, b: 2 }, assign(a)(b));
  // Should not mutate:
  t.not(a, assign(b)(a));
});

test("has", t => {
  const a = { a: { b: 0, c: false } };

  t.is(true, has("a")(a));
  t.is(true, has("a.b")(a));
  t.is(true, has("a.c")(a));
  t.is(false, has("a.x")(a));
  t.is(false, has()());
});

test("mapEntry", t => {
  const entry = ["a", 2];

  t.deepEqual(["a_a", 3], mapEntry(k => `${k}_${k}`, v => v + 1)(entry));
  t.deepEqual([undefined, undefined], mapEntry(n => n, n => n)());
});

test("mapObject", t => {
  const a = { a: 1, b: "a" };
  const map = mapEntry(k => `${k}_${k}`, v => v + 1);

  t.deepEqual({ a_a: 2 }, mapObject(map, ([_, v]) => typeof v === "number")(a));
  t.deepEqual({}, mapObject(n => n)());
});

test("objectFromEntry", t => {
  t.deepEqual({ a: 1 }, objectFromEntry(["a", 1]));
  t.deepEqual({}, objectFromEntry());
});
