import test from "ava";

import { is, isValueAt } from "../index";

test("is", t => {
  t.is(true, is(2)(2));
  t.is(true, is("a")("a"));
  t.is(true, is(false)(false));
  t.is(true, is(null)(null));

  t.is(false, is(2)(1));
  t.is(false, is(2)("2"));
  t.is(false, is({ a: 1 })({ a: 1 }));
});

test("isAtKey: object", t => {
  t.is(true, isValueAt("a")(2)({ a: 2 }));
  t.is(false, isValueAt("a")(3)({ a: 2 }));
});

test("isAtKey: array", t => {
  t.is(true, isValueAt(1)(1)([0, 1, 2]));
  t.is(false, isValueAt(1)(2)([0, 1, 2]));
});
