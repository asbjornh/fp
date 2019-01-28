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

## Notable core functions

### reduce(_**reducer**: function, **initial**: any, **map?**: function, **filter?**: function_): ((_**arr**: any[]_) => any[])

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

## Extra utils

### array(_**length**: string, **mapper**: function, **filter**: function_): any[]

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

### get(_**keys**: string | number | (string | number)[], **default**: any_): (obj: object | array) => any

Safely get children properties of an object (like `lodash/get` with different syntax).

```js
const obj = { a: ["nope", "yep"] };
get("a")(obj); // ["nope", "yep"]
get(["a", 1])(obj); // "yep"
get(["a", "b", "c"], "nothing")(obj); // "nothing"
```

### match(_**...patterns**: [predicate: function, map: function][]_): (value: any) => any

Inspired by (but not the same as) [pattern matching](https://stackoverflow.com/questions/2502354/what-is-pattern-matching-in-functional-languages) from other functional languages.

```js
const matcher = match([isEven, v => `${v} is even!`], [isOdd, v => `${v} is odd!`]);
matcher(1); // "1 is odd!"
matcher(2); // "2 is even!"
matcher("a"); // undefined
```

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

### Pipe(_**...funcs**: function[]_): function

Performs left-to-right function composition. Mostly like Ramdas [pipe](https://ramdajs.com/docs/#pipe) except all functions must be unary.

```js
const addTwoAndDouble = makePipe(add(2), multiply(2));

addTwoAndDouble(1); // 6
[1, 2].map(addTwoAndDouble); // [6, 8]
```

### trace(_**value**: any_): any

Accepts a single value, logs it using `console.log` and returns the value. Useful for debugging pipelines.

```js
Pipe(
  add(2),
  trace, // logs "3" to the console
  multiply(2),
  trace // Logs "6" to the console
)(1);
```

## <a id='core'></a> Core functions
