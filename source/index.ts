import { get, match, not, otherwise, Pipe, trace } from "./utils";
export { get, match, not, otherwise, Pipe, trace };

// Misc
/** Returns a [constant function](https://en.wikipedia.org/wiki/Constant_function) of `x` */
export const always = x => () => x;
/** Compares to `null` and `undefined` */
export const exists = x => x !== undefined && x !== null;
/** Identity function */
export const id = x => x;
/** Returns `x` if it exists. Otherwise returns `fallback` */
export const or = fallback => x => (exists(x) ? x : fallback);
/** Always returns `false` */
export const no = () => false;
/** Always returns `undefined` */
export const noop = () => {};
/** Always returns `true` */
export const yes = () => true;

/** Runs the `ifFunc` or the `elseFunc` based on the result of `predicate(v)` */
export const mapIf = (predicate, ifFunc = id, elseFunc = id) => v =>
  predicate(v) ? ifFunc(v) : elseFunc(v);

// Predicates

/** Is `a` greater than `b`? */
export const gt = b => a => a > b;
/** Is `a` greater than or equal to `b`? */
export const gte = b => a => a >= b;
/** Is `a` less than `b`? */
export const lt = b => a => a < b;
/** Is `a` less than or equal to `b`? */
export const lte = b => a => a <= b;
/** Is `a` equal to `b`? */
export const is = a => b => a === b;
export const isNumber = n => typeof n === "number";
export const isString = n => typeof n === "string";
export const isEven = n => isNumber(n) && n % 2 === 0;
export const isOdd = n => isNumber(n) && n % 2 !== 0;
export const isOneOf = (...values) => v => values.includes(v);
export const isAtPath = (path, predicate) => v => predicate(get(path)(v));
export const isAtIndex = (index, predicate) => isAtPath(`[${index}]`, predicate);
/** Checks whether the `v` fulfils all the `predicates` */
export const isAll = (...predicates) => v =>
  predicates.reduce((a, pred) => a && pred(v), predicates.length ? true : false);
/** Checks whether the `v` fulfils some of the `predicates` */
export const isSome = (...predicates) => v =>
  predicates.reduce((a, pred) => a || pred(v), false);

// safeString
const sS = str => (exists(str) && typeof str === "string" ? str : "");

// String
export const charCodeAt = index => str => sS(str).charCodeAt(index);
export const endsWith = term => str => sS(str).endsWith(term);
export const fromCharCode = num => String.fromCharCode(num);
export const padEnd = (length, char) => str => sS(str).padEnd(length, char);
export const padStart = (length, char) => str => sS(str).padStart(length, char);
export const repeat = length => str => sS(str).repeat(length);
export const replace = (regexp, newStr) => str => sS(str).replace(regexp, newStr);
export const split = sep => str => sS(str).split(sep);
export const startsWith = term => str => sS(str).startsWith(term);
export const substring = (start, end) => str => sS(str).substring(start, end);
export const toLowerCase = str => sS(str).toLowerCase();
export const toUpperCase = str => sS(str).toUpperCase();
export const trim = str => sS(str).trim();

/** SafeArray */
const sA = arr => (Array.isArray(arr) ? arr : []);
const ensureArray = a => (Array.isArray(a) ? a : exists(a) ? [a] : []);

// Array

/** Creates an array. Kind of similar to list comprehension in python
```js
array(5); // [0, 1, 2, 3, 4, 5]
array(5, add(1), isEven); // [0, 3, 5]
```
 */
export const array = (range = 0, mapper = id, filter = v => true): any[] =>
  new Array(range).fill(0).reduce((a, _, i) => a.concat(filter(i) ? mapper(i) : []), []);

/** Concatenates `b` into `a`. Does not concat `undefined` or `null`
```js
concat(2)([1]); // [1, 2]
```
 */
export const concat = b => a => ensureArray(a).concat(ensureArray(b));

/** Concatenates `a` into `b`. Does not concat `undefined` or `null`
```js
concat([1])(2); // [1, 2]
```
 */
export const concatRight = a => b => ensureArray(a).concat(ensureArray(b)); // Doesn't concat undefined/null
export const every = func => arr => sA(arr).every(func);
export const filter = func => arr => sA(arr).filter(func);
export const find = func => arr => sA(arr).find(func);
export const findIndex = func => arr => sA(arr).findIndex(func);
export const forEach = (...funcs) => arr => sA(arr).forEach(Pipe(...funcs));
export const includes = thing => arr => sA(arr).includes(thing);
export const indexOf = term => arr => sA(arr).indexOf(term);
export const join = (sep: string) => arr => sA(arr).join(sep);
export const length = arr => sA(arr).length;
export const map = (...funcs) => arr => sA(arr).map(Pipe(...funcs));
export const reverse = arr => sA(arr).reverse();
export const slice = (begin, end) => arr => sA(arr).slice(begin, end);
export const some = func => arr => sA(arr).some(func);
export const sort = func => arr => sA(arr).sort(func);

/** Sort objects or arrays by key or index (or both)
```js
sortBy("a[0]")([{ a: [3] }, { a: [2] }, { a: [1] }]);
// [{ a: [1] }, { a: [2] }, { a: [3] }]
```
 */
export const sortBy = (path = "") =>
  sort((a, b) => {
    const A = get(path)(a);
    const B = get(path)(b);
    return lt(B)(A) ? -1 : gt(B)(A) ? 1 : 0;
  });

/** See `reduce` for documentation */
export const plainReduce = (func, initial) => arr =>
  sA(arr).reduce((a, c) => func(c)(a), initial);

/** See `reduce` for documentation */
export const mapFilterReduce = (reducer, initial, map, filter = v => true) => arr =>
  sA(arr).reduce((a, c) => (filter(c) ? reducer(map(c))(a) : a), initial);

/**
Note that `reducer` needs to be a higher order unary function (returning another unary function) and that the order of the current and accumulator are reversed. This makes it possible to use other functions from this package as the `reducer`.

```js
reduce(curr => accum => accum + curr, 0)([1, 2, 3]); // 6
reduce(add, 0)([1, 2, 3]); // 6
reduce(concat, [])([[1, 2], [3, 4]]); // [1, 2, 3, 4]
```

`map` and `filter` can be used to do many operations that otherwise would require iterating over a list many times, like `[].filter(fn).map(fn).reduce(fn)` which can be orders of magnitude slower. Filtering happens before mapping.

```js
const numbers = [1, 2, 3, 4];

// 4 iterations
reduce(add, 0, pow(2), isEven)(numbers); // 20

// 4 + 2 + 2 iterations
Pipe(filter(isEven), map(pow(2)), reduce(add))(numbers); // 20
```
*/
export const reduce = (reducer, initial, map, filter) =>
  map ? mapFilterReduce(reducer, initial, map, filter) : plainReduce(reducer, initial);

// Number

/** Unary version of parseInt (can safely be used in `map` etc) */
export const int = n => parseInt(n);
/** Unary version of parseFloat (can safely be used in `map` etc) */
export const float = n => parseFloat(n);
export const toFixed = (digits: number) => (num: number) =>
  isNumber(num) ? num.toFixed(digits) : "";

// Math
export const add = b => a => a + b;
export const divide = b => a => a / b;
export const multiply = b => a => a * b;
export const subtract = b => a => a - b;

export const max = arr => Math.max(...arr);
export const min = arr => Math.min(...arr);
export const clamp = (min, max) => n => Math.min(max, Math.max(min, n));
export const pow = exp => base => Math.pow(base, exp);
export const rangeMap = (inMin, inMax, outMin, outMax) => n =>
  ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

// Object
export const assign = b => a => Object.assign({}, a, b);
/** Checks whether `obj` has a value at the given `path`. Not to be confused with `object.hasOwnProperty` */
export const has = (path = "") => obj => exists(get(path)(obj));
type Entry = [string?, any?];
export const objectFromEntry = ([k, v]: Entry = []) => (k ? { [k]: v } : {});
export const mapEntry = (mapKey, mapValue) => ([k, v]: Entry = []) => [
  mapKey(k),
  mapValue(v)
];
export const mapObject = (map, filter) => (obj = {}) =>
  reduce(assign, {}, Pipe(map, objectFromEntry), filter)(Object.entries(obj));
