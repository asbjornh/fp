# fp

A collection of higher order utility functions for doing FP-like stuff in javascript. The point of this package is mainly to provide function wrappers for native javascript methods that can be partially applied (and piped) with better handling of `undefined`.

## Argument order

The higher order functions all return a function of the input data (meaning the data comes last as opposed to the native javascript equivalents), making partial application possible.

```js
padStart(4, "_")("A");
"A" |> padStart(4, "_");
```

## Core functions

These functions are mostly wrappers for native javascript things that aren't easily partially applied or piped. They are all so small that reading the [implementation](./index.js) is probably faster than reading their (lacking) documentation.

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

### Pipe(_...funcs: function_): function

Performs left-to-right function composition. Mostly like Ramdas [pipe](https://ramdajs.com/docs/#pipe) except all functions must be unary.

```js
const addTwoAndDouble = makePipe(add(2), multiply(2));

addTwoAndDouble(1); // 6
[1, 2].map(addTwoAndDouble); // [6, 8]
```

### trace(_**value**: any_): value

Accepts a single value, logs it using `console.log` and returns the value. Useful for debugging pipelines.

```js
Pipe(
  add(2),
  trace, // logs "3" to the console
  multiply(2),
  trace // Logs "6" to the console
)(1);
```
