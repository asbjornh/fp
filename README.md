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

// 'padStart' and 'map' from this package (data last)
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
