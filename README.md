# fp

A collection of utility functions for doing FP-like stuff in javascript. The point of this package is mainly to provide function wrappers for native javascript methods that can be partially applied (and piped) with better handling of `undefined`.

## Currying

The core functions are all curried-ish (I don't know the proper terminology), which means that all of the following calls are valid:

```js
padStart(4, "_", "A"); // "___A"
padStart(4, "_")("A"); // "___A"
padStart(4)("_", "A"); // "___A"
padStart(4)("_")("A"); // "___A"
```

This might trigger purists, but in some cases it eliminates the need for using arrow functions with `reduce` which is nice:

```js
reduce(add, 0, [1, 2, 3]); // If 'add' was unary this wouldn't fly
```

## Argument order

For most of the functions, the data on which to perform the action is given as the last argument (which makes the most sense for partial application).

```js
padStart(4, "_")("A");
"A" |> padStart(4, "_");
```

## Utility functions

None of these functions are curried.

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

In all three cases, the output is `[0, 4, 16]`

### curry(_**func**: function_): function

Given a function, returns a semi-curried version of that function. This curry function is applied to all of the core functions that accept more than one argument.

### makePipe(_...funcs: function_): function

Performs left-to-right function composition. Mostly like Ramdas [pipe](https://ramdajs.com/docs/#pipe) except all functions must be unary.

```js
const addTwoAndDouble = makePipe(add(2), multiply(2));
addTwoAndDouble(1); // 6
```

### pipe(_**value**: any, ...**funcs**: function_): any

Emulates the behaviour of the proposed [pipeline operator](https://github.com/tc39/proposal-pipeline-operator).

```js
pipe(
  1,
  add(2),
  multiply(2)
); // 6
```

### trace(_**value**: any_): value

Accepts a single value, logs it using `console.log` and returns the value. Useful for debugging pipelines.

```js
pipe(
  1,
  add(2),
  trace, // logs "3" to the console
  multiply(2),
  trace // Logs "6" to the console
);
```

## Core functions

These functions are mostly wrappers for native javascript things that aren't easily partially applied or piped. They are all so small that reading the [implementation](./index.js) is probably faster than reading their (lacking) documentation.
