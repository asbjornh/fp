export const makePipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);
export const pipe = (value, ...funcs) => makePipe(...funcs)(value);

// eslint-disable-next-line no-console
export const trace = v => console.log(v) || v;

// Util
export const exists = a => a !== undefined && a !== null;
export const id = x => x;
export const or = fallback => v => (exists(v) ? v : fallback);
export const no = () => false;
export const yes = () => true;

// Comparison
export const gt = b => a => a > b;
export const gte = b => a => a >= b;
export const is = a => b => a === b;
export const isEven = n => n % 2 === 0;
export const isOdd = n => !isEven(n);
export const isNumber = n => typeof n === "number";
export const lt = b => a => a < b;
export const lte = b => a => a <= b;

// safeString
const sS = str => (exists(str) && typeof str === "string" ? str : "");

// String
export const charCodeAt = index => str => sS(str).charCodeAt(index);
export const endsWith = term => str => sS(str).endsWith(term);
export const fromCharCode = num => String.fromCharCode(num);
export const match = regexp => str => sS(str).match(regexp);
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
export const forEach = func => arr => sA(arr).forEach(func);
export const includes = thing => arr => sA(arr).includes(thing);
export const indexOf = term => arr => sA(arr).indexOf(term);
export const join = sep => arr => sA(arr).join(sep);
export const length = arr => sA(arr).length;
export const map = func => arr => sA(arr).map(func);
export const reduce = (func, initial) => arr =>
  sA(arr).reduce((a, c) => func(c)(a), initial);
export const reduceRight = (func, initial) => arr => sA(arr).reduceRight(func, initial);
export const reverse = arr => sA(arr).reverse();
export const slice = (begin, end) => arr => sA(arr).slice(begin, end);
export const some = func => arr => sA(arr).some(func);
export const sort = func => arr => sA(arr).sort(func);
export const sortBy = key => sort((a, b) => (a || {})[key] - (b || {})[key]);
export const tupleMap = (left = id, right = id) => ([l, r]) => [left(l), right(r)];
// TODO: tupleMap ?

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
export const random = (a = 1) => () => a * Math.random();
export const rangeMap = (inMin, inMax, outMin, outMax) => n =>
  ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
export const sum = reduce(add, 0);

export const radians = deg => (deg * Math.PI) / 180;
export const cos = deg => Math.cos(radians(deg));
export const sin = deg => Math.sin(radians(deg));
export const tan = deg => Math.tan(radians(deg));

// Object
export const assign = b => a => Object.assign({}, a, b);
export const get = key => obj => (obj || {})[key];
export const tupleToObject = (mapKey = id, mapValue = id) => ([k, v]) => ({
  [mapKey(k)]: mapValue(v)
});

const reduceMore = (reducer, init, map = id, filter = yes) => arr =>
  sA(arr).reduce((a, c) => (filter(c) ? reducer(map(c))(a) : a), init);

const { log } = console;
log(reduce(add, 1)([1, 2, 3]));
log(reduceMore(concat, [])([[1], [2], [3]]));
log(reduceMore(concat, [], makePipe(add(1), multiply(2)))([1, 2, 3]));

map(makePipe(add(1), multiply(2)))([1, 2, 3]);
[1, 2, 3].reduce((a, c) => a.concat((c + 1) * 2), []);

const isAtKey = (key, predicate) => makePipe(get(key), predicate);

const o = { a: 1, b: 2, c: 3, d: 4, e: "5" };

const a = reduceMore(assign, {}, tupleToObject(id, pow(2)), isAtKey(1, isNumber))(
  Object.entries(o)
);

log(a);
