import test from "ava";

import { isEven, isOdd } from "../source/index";

import { exists, id, mapIf, no, noop, or, yes } from "../source/index";

const macro = (t, expected, input) => {
  t.deepEqual(expected, input);
};

test("exists", t => {
  t.is(true, exists(0));
  t.is(true, exists(false));
  t.is(true, exists(""));
  t.is(false, exists());
  t.is(false, exists(null));
});

test("id", t => {
  t.is(1, id(1));
  t.is(undefined, id());
});

test("mapIf", t => {
  t.is("1", mapIf(isEven, n => n * 10, String)(1));
  t.is(1, mapIf(isEven, n => n * 10)(1)); // Defaults to id
  t.is(10, mapIf(isOdd, n => n * 10, String)(1));
});

test("or", t => {
  t.is(1, or(0)(1));
  t.is(0, or(0)());
});

test("no", macro, false, no());
test("yes", macro, true, yes());

test("noop", macro, undefined, noop(1));
