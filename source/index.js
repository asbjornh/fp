import { get, match, otherwise, Pipe } from "./utils";
export { get, match, otherwise, Pipe };

// Misc
export const exists = a => a !== undefined && a !== null;
export const id = x => x;
export const or = fallback => v => (exists(v) ? v : fallback);
export const no = () => false;
export const noop = () => {};
export const yes = () => true;

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
export const isAtKey = (key, predicate) => v => predicate(get(key)(v));
export const isAtIndex = (index, predicate) => isAtKey(index, predicate);
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
export const sortBy = (keys = []) =>
  sort((a, b) => {
    const A = get(keys)(a);
    const B = get(keys)(b);
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
export const has = (keys = []) => obj => exists(get(keys)(obj));
export const objectFromEntry = ([k, v] = []) => (exists(k) ? { [k]: v } : {});
export const mapEntry = (mapKey, mapValue) => ([k, v] = []) => [mapKey(k), mapValue(v)];
export const mapObject = (map, filter) => (obj = {}) =>
  reduce(assign, {}, Pipe(map, objectFromEntry), filter)(Object.entries(obj));
