import test from "ava";

import { gt, gte, is, isEven, isOdd, lt, lte } from "../index";

const macro = (t, expected, input) => {
  t.is(expected, input);
};

test("gt", t => {
  t.is(true, gt(2)(3));
  t.is(false, gt(2)(2));
  t.is(false, gt(2)(1));
});

test("gte", t => {
  t.is(true, gte(2)(3));
  t.is(true, gte(2)(2));
  t.is(false, gte(2)(1));
});

test("is", t => {
  t.is(true, is(2)(2));
  t.is(true, is("a")("a"));
  t.is(true, is(false)(false));
  t.is(true, is(null)(null));

  t.is(false, is(2)(1));
  t.is(false, is(2)("2"));
  t.is(false, is({ a: 1 })({ a: 1 }));
});

test("isEven: true", macro, true, isEven(2));
test("isEven: false", macro, false, isEven(3));
test("isOdd: true", macro, true, isOdd(3));
test("isOdd: false", macro, false, isOdd(2));

test("lt", t => {
  t.is(false, lt(2)(3));
  t.is(false, lt(2)(2));
  t.is(true, lt(2)(1));
});

test("lte", t => {
  t.is(false, lte(2)(3));
  t.is(true, lte(2)(2));
  t.is(true, lte(2)(1));
});
