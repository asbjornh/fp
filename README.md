# fp

A collection of utility functions for doing FP-like stuff in javascript.

Most of the functions are just wrappers of native javascript methods.

## Currying

The core functions are all semi-curried (in lack of a better term), which means that all of the following calls are valid:

```js
padStart(4, "_", "A"); // "___A"
padStart(4, "_")("A"); // "___A"
padStart(4)("_", "A"); // "___A"
padStart(4)("_")("A"); // "___A"
```

For most of the functions, the data on which to perform the action is given as the last argument (to be able to do partial application in pipelines).

```js
"A" |> padStart(4, "_"); // "___A"
[1, 2, 3] |> map(n => n + 1); // [2, 3, 4]
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

These functions are mostly wrappers for native javascript things that aren't easily partially applied or piped. They are all so small that reading the implementation is probably faster than reading their (lacking) documentation, so here they are:

```js
// Util
is = curry((a, b) => a === b);
isValueAt = curry((key, v, obj) => obj[key] === v);

// String
charCodeAt = curry((index, str) => str.charCodeAt(index));
endsWith = curry((term, str) => str.endsWith(term));
fromCharCode = num => String.fromCharCode(num);
match = curry((regexp, str) => str.match(regexp));
padEnd = curry((length, padStr, str) => str.padEnd(length, padStr));
padStart = curry((length, padStr, str) => str.padStart(length, padStr));
repeat = curry((length, str) => str.repeat(length));
replace = curry((regexp, newStr, str) => str.replace(regexp, newStr));
split = curry((sep, str) => str.split(sep));
startsWith = curry((term, str) => str.startsWith(term));
substring = curry((start, end, str) => str.substring(start, end));
toLowerCase = str => str.toLowerCase();
toUpperCase = str => str.toUpperCase();
trim = str => str.trim();

// Array
concat = curry((b, a) => a.concat(b));
concatRight = curry((a, b) => a.concat(b));
every = curry((func, arr) => arr.every(func));
filter = curry((func, arr) => arr.filter(func));
find = curry((func, arr) => arr.find(func));
findIndex = curry((func, arr) => arr.findIndex(func));
forEach = curry((func, arr) => arr.forEach(func));
includes = curry((thing, arr) => arr.includes(thing));
indexOf = curry((term, str) => str.indexOf(term));
join = curry((sep, arr) => arr.join(sep));
length = arr => arr.length;
map = curry((func, arr) => arr.map(func));
reduce = curry((func, initial, arr) => arr.reduce(func, initial));
reduceRight = curry((func, initial, arr) => arr.reduceRight(func, initial));
reverse = arr => arr.reverse();
slice = curry((begin, end, arr) => arr.slice(begin, end));
some = curry((func, arr) => arr.some(func));
sort = curry((func, arr) => arr.sort(func));
sortByValueAt = key => sort((a, b) => a[key] - b[key]);

// Number
int = n => parseInt(n);
float = n => parseFloat(n);
isEven = n => n % 2 === 0;
isOdd = n => !isEven(n);
toFixed = curry((dec, num) => num.toFixed(dec));

// Math
add = curry((b, a) => a + b);
divide = curry((b, a) => a / b);
multiply = curry((b, a) => a * b);
subtract = curry((b, a) => a - b);

max = arr => Math.max(...arr);
min = arr => Math.min(...arr);
clamp = curry((min, max, n) => Math.min(max, Math.max(min, n)));
pow = curry((exp, base) => Math.pow(base, exp));
random = (a = 1) => () => a * Math.random();
sum = reduce(add, 0);
rangeMap = curry(
  (inMin, inMax, outMin, outMax, n) =>
    ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
);

radians = deg => (deg * Math.PI) / 180;
cos = deg => Math.cos(radians(deg));
sin = deg => Math.sin(radians(deg));
tan = deg => Math.tan(radians(deg));

// Object
assign = curry((b, a) => Object.assign({}, a, b));
```
