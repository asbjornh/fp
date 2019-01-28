import test from "ava";

import { exists, id, no, noop, or, yes } from "../index";

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

test("or", t => {
  t.is(1, or(0)(1));
  t.is(0, or(0)());
});

test("no", macro, false, no());
test("yes", macro, true, yes());

test("noop", macro, undefined, noop(1));
