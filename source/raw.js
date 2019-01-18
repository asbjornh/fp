// Util
export const is = (a, b) => a === b;
export const isValueAt = (key, v, obj) => obj[key] === v;

// String
export const charCodeAt = (index, str) => str.charCodeAt(index);
export const endsWith = (term, str) => str.endsWith(term);
export const fromCharCode = num => String.fromCharCode(num);
export const match = (regexp, str) => str.match(regexp);
export const padEnd = (length, padStr, str) => str.padEnd(length, padStr);
export const padStart = (length, padStr, str) => str.padStart(length, padStr);
export const repeat = (length, str) => str.repeat(length);
export const replace = (regexp, newStr, str) => str.replace(regexp, newStr);
export const split = (sep, str) => str.split(sep);
export const startsWith = (term, str) => str.startsWith(term);
export const substring = (start, end, str) => str.substring(start, end);
export const toLowerCase = str => str.toLowerCase();
export const toUpperCase = str => str.toUpperCase();
export const trim = str => str.trim();

// Array
export const array = (length = 0, mapper = n => n, filter = () => true) =>
  new Array(length).fill(0).reduce((a, _, i) => a.concat(filter(i) ? mapper(i) : []), []);
export const concat = (b, a) => a.concat(b);
export const concatRight = (a, b) => a.concat(b);
export const every = (func, arr) => arr.every(func);
export const filter = (func, arr) => arr.filter(func);
export const find = (func, arr) => arr.find(func);
export const findIndex = (func, arr) => arr.findIndex(func);
export const forEach = (func, arr) => arr.forEach(func);
export const includes = (thing, arr) => arr.includes(thing);
export const indexOf = (term, str) => str.indexOf(term);
export const join = (sep, arr) => arr.join(sep);
export const length = arr => arr.length;
export const map = (func, arr) => arr.map(func);
export const reduce = (func, initial, arr) => arr.reduce(func, initial);
export const reduceRight = (func, initial, arr) => arr.reduceRight(func, initial);
export const reverse = arr => arr.reverse();
export const slice = (begin, end, arr) => arr.slice(begin, end);
export const some = (func, arr) => arr.some(func);
export const sort = (func, arr) => arr.sort(func);
export const sortByValueAt = (key, arr) => arr.sort((a, b) => a[key] - b[key]);

// Number
export const int = n => parseInt(n);
export const float = n => parseFloat(n);
export const isEven = n => n % 2 === 0;
export const isOdd = n => !isEven(n);
export const toFixed = (dec, num) => num.toFixed(dec);

// Math
export const add = (b, a) => a + b;
export const divide = (b, a) => a / b;
export const multiply = (b, a) => a * b;
export const subtract = (b, a) => a - b;

export const max = arr => Math.max(...arr);
export const min = arr => Math.min(...arr);
export const clamp = (min, max, n) => Math.min(max, Math.max(min, n));
export const pow = (exp, base) => Math.pow(base, exp);
export const random = (a = 1) => () => a * Math.random();
export const rangeMap = (inMin, inMax, outMin, outMax, n) =>
  ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
export const sum = arr => reduce(add, 0, arr);

export const radians = deg => (deg * Math.PI) / 180;
export const cos = deg => Math.cos(radians(deg));
export const sin = deg => Math.sin(radians(deg));
export const tan = deg => Math.tan(radians(deg));

// Object
export const assign = (b, a) => Object.assign({}, a, b);
