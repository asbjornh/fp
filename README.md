# kompis

A collection of plain and higher order functions for doing composition stuff in javascript.

## Usage

```
npm install kompis
```

All exports are named. Example:

```js
import { Pipe, map, add } from "kompis";
Pipe(map(add(10)));

// You can also do:
import * as K from "kompis";
K.Pipe(K.map(K.add(10)));
```

## ES6

ES6 source can be imported from `kompis/es6` (it's about a third of the size of the regular ES5 version).

## About

The functions can be divided in two groups: core functions and utils. The utils are properly documented below. The core functions are all pretty small so their implementations are included (without further documentation) [at the bottom](#core) of this readme.

## Argument order

Higher order functions that accept more than one thing accept the data to operate on last (opposite of native js counerparts). This makes partial application more practical.

```js
// Vanilla javascript (data first)
"A".padStart(3, "_"); // "__A"
[1, 2, 3].map(n => n + 1); // [2, 3, 4]

// 'padStart' from this package (data last)
padStart(3, "_")("A"); // "__A"
map(add(1))([1, 2, 3]); // [2, 3, 4]
```

Note: this also applies to math functions like `subtract` and `divide`:

```js
// Vanilla javascript
2 / 4; // 0.5

// 'divide' from this package
const divideByTwo = divide(2);
divideByTwo(4); // 2
divide(2)(4); // also 2
```

## Utils

### array

array(_**length**: string, **mapper**: function, **filter**: function_): any[]

Inspired by list comprehension in other languages.

In python you would do this:

```python
[i * i for i in range(5) if i % 2 == 0]
```

With `array` this becomes:

```js
array(5, i => i * i, i => i % 2 === 0); // Verbose lambda version
array(5, pow(2), isEven); // Using other utils from this package
```

In both cases, the output is `[0, 4, 16]`

### get

get(_**path**: string, **default**: any_): (obj: object | array) => any

Safely get children properties of an object (like `lodash/get` but with the object last).

```js
const obj = { a: ["nope", "yep"] };
get("a")(obj); // ["nope", "yep"]
get("a[1]")(obj); // "yep"
get("a.b.c", {})(obj); // {}
```

### match

match(_**...patterns**: [predicate: function, map: function][]_): (value: any) => any

Inspired by (but not the same as) [pattern matching](https://stackoverflow.com/questions/2502354/what-is-pattern-matching-in-functional-languages) from other functional languages.

```js
const matcher = match([isEven, v => `${v} is even!`], [isOdd, v => `${v} is odd!`]);
matcher(1); // "1 is odd!"
matcher(2); // "2 is even!"
matcher("a"); // undefined
```

#### Recursion

If you use `match` recursively you'll get a maximum call stack exceeded error. To avoid this, execute `match` with a value explicitly if you need recursion:

```js
// This will always create a maximum call stack exceeded error
const badMatch = match([somePredicate, badMatch], [otherwise, n => n]);

// This won't
const goodMatch = value => match([somePredicate, goodMatch], [otherwise, n => n])(value);
```

#### Fallback value

If you need a fallback pattern, you can use the `otherwise` function in the _**last**_ pattern (`otherwise` always returns `true`).

```js
const matcher = match(
  [isEven, v => `${v} is even!`],
  [isOdd, v => `${v} is odd!`],
  [otherwise, () => "No match"]
);
matcher(1); // "1 is odd!"
matcher(2); // "2 is even!"
matcher("a"); // "No match"
```

### Pipe

Pipe(_**...funcs**: function[]_): function

Performs left-to-right function composition. Mostly like Ramdas [pipe](https://ramdajs.com/docs/#pipe) except all functions must be unary.

```js
const addTwoAndDouble = makePipe(add(2), multiply(2));

addTwoAndDouble(1); // 6
[1, 2].map(addTwoAndDouble); // [6, 8]
```

### trace

trace(_**label**: string): (_**value**: any\_) => any

Accepts a label and then a single value, logs it using `console.log` and returns the value. Useful for debugging pipelines.

```js
Pipe(
  add(2),
  trace(), // logs "3" to the console
  multiply(2),
  trace("final:") // Logs "final: 6" to the console
)(1);
```

## Notable core functions

### reduce

reduce(_**reducer**: function, **initial**: any, **map?**: function, **filter?**: function_): (_**arr**: any[]_) => any[]

Note that `reducer` needs to be a higher order unary function (returning another unary function) and that the order of the current and accumulator are reversed. This makes it possible to use other functions from this package as the `reducer`.

```js
reduce(curr => accum => accum + curr, 0)([1, 2, 3]); // 6
reduce(add, 0)([1, 2, 3]); // 6
reduce(concat, [])([[1], [2], [3]]);
```

`map` and `filter` can be used to do many operations that otherwise would require iterating over a list many times, like `[].map(fn).filter(fn).reduce(fn)` which can be orders of magnitude slower.

```js
const numbers = [1, 2, 3, 4];

// 4 iterations
reduce(add, 0, pow(2), isEven)(numbers); // 20

// 4 + 2 + 2 iterations
Pipe(filter(isEven), map(pow(2)), reduce(add))(numbers); // 20
```

## <a id='core'></a> Core functions

```js
import { get, match, otherwise, Pipe, trace } from "./utils";
export { get, match, otherwise, Pipe, trace };

// Misc
export const exists = a => a !== undefined && a !== null;
export const id = x => x;
export const or = fallback => v => (exists(v) ? v : fallback);
export const no = () => false;
export const noop = () => {};
export const yes = () => true;

export const mapIf = (predicate = yes, ifFunc = id, elseFunc = id) => v =>
  predicate(v) ? ifFunc(v) : elseFunc(v);

// Predicates
export const gt = b => a => a > b;
export const gte = b => a => a >= b;
export const lt = b => a => a < b;
export const lte = b => a => a <= b;
export const is = a => b => a === b;
export const isNumber = n => typeof n === "number";
export const isString = n => typeof n === "string";
export const isEven = n => isNumber(n) && n % 2 === 0;
export const isOdd = n => isNumber(n) && n % 2 !== 0;
export const isAtPath = (path, predicate) => v => predicate(get(path)(v));
export const isAtIndex = (index, predicate) => isAtPath(`[${index}]`, predicate);
export const isAll = (...predicates) => v =>
  predicates.reduce((a, pred) => a && pred(v), predicates.length ? true : false);
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

// safeArray
const sA = arr => (Array.isArray(arr) ? arr : []);
const ensureArray = a => (Array.isArray(a) ? a : exists(a) ? [a] : []);

// Array
export const array = (length = 0, mapper = id, filter = yes) =>
  new Array(length).fill(0).reduce((a, _, i) => a.concat(filter(i) ? mapper(i) : []), []);
export const concat = b => a => ensureArray(a).concat(ensureArray(b)); // Doesn't concat undefined/null
export const concatRight = a => b => ensureArray(a).concat(ensureArray(b)); // Doesn't concat undefined/null
export const every = func => arr => sA(arr).every(func);
export const filter = func => arr => sA(arr).filter(func);
export const find = func => arr => sA(arr).find(func);
export const findIndex = func => arr => sA(arr).findIndex(func);
export const forEach = (...funcs) => arr => sA(arr).forEach(Pipe(...funcs));
export const includes = thing => arr => sA(arr).includes(thing);
export const indexOf = term => arr => sA(arr).indexOf(term);
export const join = sep => arr => sA(arr).join(sep);
export const length = arr => sA(arr).length;
export const map = (...funcs) => arr => sA(arr).map(Pipe(...funcs));
export const reverse = arr => sA(arr).reverse();
export const slice = (begin, end) => arr => sA(arr).slice(begin, end);
export const some = func => arr => sA(arr).some(func);
export const sort = func => arr => sA(arr).sort(func);
export const sortBy = (path = "") =>
  sort((a, b) => {
    const A = get(path)(a);
    const B = get(path)(b);
    return lt(B)(A) ? -1 : gt(B)(A) ? 1 : 0;
  });

const plainReduce = (func, initial) => arr =>
  sA(arr).reduce((a, c) => func(c)(a), initial);
const mapFilterReduce = (reducer, initial, map, filter = yes) => arr =>
  sA(arr).reduce((a, c) => (filter(c) ? reducer(map(c))(a) : a), initial);

export const reduce = (reducer, initial, map, filter) =>
  map ? mapFilterReduce(reducer, initial, map, filter) : plainReduce(reducer, initial);

// Number
export const int = n => parseInt(n);
export const float = n => parseFloat(n);
export const toFixed = dec => num => (num ? num.toFixed(dec) : num);

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
export const has = (path = "") => obj => exists(get(path)(obj));
export const objectFromEntry = ([k, v] = []) => (exists(k) ? { [k]: v } : {});
export const mapEntry = (mapKey, mapValue) => ([k, v] = []) => [mapKey(k), mapValue(v)];
export const mapObject = (map, filter) => (obj = {}) =>
  reduce(assign, {}, Pipe(map, objectFromEntry), filter)(Object.entries(obj));

```
