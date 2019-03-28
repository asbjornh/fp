import test from "ava";

import {
  gt,
  gte,
  is,
  isAll,
  isAtIndex,
  isAtPath,
  isEven,
  isNumber,
  isOdd,
  isOneOf,
  isSome,
  isString,
  lt,
  lte
} from "../source/index";

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

test("isEven", t => {
  t.is(true, isEven(2));
  t.is(false, isEven(3));
  t.is(false, isEven("2"));
});

test("isOdd", t => {
  t.is(true, isOdd(3));
  t.is(false, isOdd(2));
  t.is(false, isOdd("3"));
});

test("isOneOf", t => {
  t.is(true, isOneOf("a", 1, true)("a"));
  t.is(true, isOneOf("a", 1, true)(1));
  t.is(true, isOneOf("a", 1, true)(true));
  t.is(false, isOneOf("a", 1, true)("c"));
  t.is(false, isOneOf("a", 1, true)());
});

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

test("isNumber", t => {
  t.is(true, isNumber(1));
  t.is(true, isNumber(1.5));
  t.is(false, isNumber("1"));
  t.is(false, isNumber());
});

test("isAtIndex", t => {
  const arr = [1, 1, 4];
  t.is(true, isAtIndex(2, isEven)(arr));
  t.is(false, isAtIndex(0, isEven)(arr));
  t.is(false, isAtIndex(10, isEven)(arr));
});

test("isAtPath", t => {
  const obj = { a: 2, b: 3, c: { d: 4 } };
  t.is(true, isAtPath("a", isEven)(obj));
  t.is(true, isAtPath("c.d", is(4))(obj));
  t.is(false, isAtPath("b", isEven)(obj));
  t.is(false, isAtPath("x", isEven)(obj));
});

test("isAll", t => {
  t.is(true, isAll(isNumber, isEven)(2));
  t.is(false, isAll(isNumber, isOdd)(2));
  t.is(false, isAll(isNumber, isOdd)("1"));
  t.is(false, isAll()());
});

test("isSome", t => {
  t.is(true, isSome(isString, isEven)(2));
  t.is(true, isSome(isString, isEven)("1"));
  t.is(false, isSome(isString, isEven)(1));
  t.is(false, isSome()());
});

test("isString", t => {
  t.is(true, isString("a"));
  t.is(true, isString(""));
  t.is(false, isString(1));
});
