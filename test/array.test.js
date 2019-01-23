import test from "ava";

// NOTE: Used for more readable tests
import { is, isEven, multiply, pow } from "../index";

import {
  array,
  concat,
  concatRight,
  every,
  filter,
  find,
  findIndex,
  forEach,
  includes,
  indexOf,
  join,
  length,
  map,
  reduce,
  reduceRight,
  reverse,
  slice,
  some,
  sort,
  sortBy
} from "../index";

const macro = (t, expected, input) => {
  t.deepEqual(expected, input);
};

test("array", macro, [0, 4, 16], array(5, pow(2), isEven));

test("concat", macro, [1, 2], concat(2)([1]));
test("concat: empty", macro, [], concat()());
test("concatRight", macro, [1, 2], concatRight([1])(2));
test("concatRight: empty", macro, [], concatRight()());
test("every: true", macro, true, every(isEven)([2, 4, 6]));
test("every: false", macro, false, every(isEven)([2, 4, 5]));
test("every: empty", macro, true, every(() => {})()); // array.every always returns true for empty arrays
test("filter", macro, [0, 2, 4], filter(isEven)([0, 1, 2, 3, 4, 5]));
test("filter: empty", macro, [], filter(isEven)());
test("find", macro, 2, find(is(2))([0, 1, 2]));
test("find: empty", macro, undefined, find(is(2))());
test("findIndex", macro, 1, findIndex(is(1))([0, 1, 2]));
test("findIndex: empty", macro, -1, findIndex(is(1))());
test("includes: true", macro, true, includes(2)([0, 1, 2]));
test("includes: false", macro, false, includes(3)([0, 1, 2]));
test("includes: empty", macro, false, includes(3)());
test("indexOf", macro, 1, indexOf(1)([0, 1, 2]));
test("indexOf: empty", macro, -1, indexOf(1)());
test("join", macro, "012", join("")([0, 1, 2]));
test("join: empty", macro, "", join("")());
test("length", macro, 3, length([0, 1, 2]));
test("length: empty", macro, 0, length());
test("map", macro, [0, 2, 4], map(multiply(2))([0, 1, 2]));
test("map: empty", macro, [], map(multiply(2))());
test("reduce", macro, 3, reduce((a, c) => a + c)(0)([0, 1, 2]));
test("reduce: empty", macro, 0, reduce((a, c) => a + c)(0)());
test("reduceRight", macro, "321", reduceRight((a, c) => a + String(c), "")([1, 2, 3]));
test("reduceRight: empty", macro, "", reduceRight((a, c) => a + String(c), "")());
test("reverse", macro, [3, 2, 1], reverse([1, 2, 3]));
test("reverse: empty", macro, [], reverse());
test("slice", macro, [1, 2], slice(1)(3)([0, 1, 2]));
test("slice: empty", macro, [], slice(1)(3)());
test("some: true", macro, true, some(is(2))([0, 1, 2]));
test("some: false", macro, false, some(is(3))([0, 1, 2]));
test("some: empty", macro, false, some(is(3))()); // array.some always returns false for empty arrays
test("sort", macro, [0, 1, 2], sort()([2, 0, 1]));
test("sort: empty", macro, [], sort()());
test(
  "sortBy",
  macro,
  [{ a: 0 }, { a: 1 }, { a: 2 }],
  sortBy("a")([{ a: 2 }, { a: 0 }, { a: 1 }])
);
test(
  "sortBy: numeric keys",
  macro,
  [["a", 0], ["a", 1], ["a", 2]],
  sortBy(1)([["a", 2], ["a", 0], ["a", 1]])
);
test("sortBy: empty", macro, [], sortBy("a")());
test("sortBy: non-object elements", macro, [1, 2], sortBy("a")([1, 2]));

test("forEach", t => {
  let sum = 0;

  forEach(() => {
    sum++;
  })([0, 0, 0]);

  t.is(3, sum);
});
test("forEach: empty", macro, undefined, forEach(() => {})());
