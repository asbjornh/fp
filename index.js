export const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);

// eslint-disable-next-line no-console
export const trace = v => console.log(v) || v;

// Util
export const exists = a => a !== undefined && a !== null;
export const id = x => x;
export const or = fallback => v => (exists(v) ? v : fallback);
export const no = () => false;
export const yes = () => true;

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

const plainReduce = (func, initial) => arr =>
  sA(arr).reduce((a, c) => func(c)(a), initial);
const mapFilterReduce = (reducer, initial, map, filter = yes) => arr =>
  sA(arr).reduce((a, c) => (filter(c) ? reducer(map(c))(a) : a), initial);

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
export const reduce = (reducer, initial, map, filter) =>
  map ? mapFilterReduce(reducer, initial, map, filter) : plainReduce(reducer, initial);
export const reverse = arr => sA(arr).reverse();
export const slice = (begin, end) => arr => sA(arr).slice(begin, end);
export const some = func => arr => sA(arr).some(func);
export const sort = func => arr => sA(arr).sort(func);
export const sortBy = key => sort((a, b) => (a || {})[key] - (b || {})[key]);
// TODO: test:
export const tupleMap = (mapL = id, mapR = id) => ([l, r]) => [mapL(l), mapR(r)];

// Comparison
export const gt = b => a => a > b;
export const gte = b => a => a >= b;
export const is = a => b => a === b;
export const isEven = n => n % 2 === 0;
export const isOdd = n => !isEven(n);
export const isNumber = n => typeof n === "number";
export const isString = n => typeof n === "string";
export const lt = b => a => a < b;
export const lte = b => a => a <= b;

// TODO: tests
export const isAll = (...predicates) => value =>
  reduce(pred => a => a && pred(value), true)(predicates);
export const isSome = (...predicates) => value =>
  reduce(pred => a => a || pred(value), false)(predicates);

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
export const getMany = (...keys) => obj => reduce(c => get(c), obj)(keys);
export const tupleToObject = ([k, v]) => ({ [k]: v });
export const objectMap = (mapKey, mapValue, filterKey = yes, filterValue = yes) => {
  const map = Pipe(tupleMap(mapKey, mapValue), tupleToObject);
  const filter = isAll(Pipe(get(0), filterKey), Pipe(get(1), filterValue));
  return Pipe(Object.entries, reduce(assign, {}, map, filter));
};

const abc = { a: { b: { c: 1 } } };
console.log(getMany("a", "d", "d")(abc));

const { log } = console;
log(reduce(add, 1)([1, 2, 3]));
log(reduce(concat, [])([[1], [2], [3]]));
log(reduce(concat, [], Pipe(add(1), multiply(2)))([1, 2, 3]));

map(Pipe(add(1), multiply(2)))([1, 2, 3]);
[1, 2, 3].reduce((a, c) => a.concat((c + 1) * 2), []);

const isAtKey = (key, predicate) => Pipe(get(key), predicate);

const o = { a: 1, b: 2, c: 3, d: 4, e: "5", 6: 6, 7: "a" };

const squareValues = Pipe(tupleMap(id, pow(2)), tupleToObject);
const valueIsNumber = isAtKey(1, isNumber);
const keyIsString = isAtKey(0, n => isNaN(Number(n)));

const b = map(get("a"))([o, o, o]);

log(b);

const a = reduce(assign, {}, squareValues, isAll(keyIsString, valueIsNumber))(
  Object.entries(o)
);

log(a);

const incrementEvenValues = objectMap(id, add(1), yes, isEven);
log(incrementEvenValues({ a: 1, b: 2, c: 3, d: 4 })); // { a_new: 2, b_new: 3, c_new: 4 }

map(Pipe(get("node"), tupleMap(get("key.name"), get("value"), tupleToObject)));
