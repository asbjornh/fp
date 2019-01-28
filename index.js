export const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);

// eslint-disable-next-line no-console
export const trace = v => console.log(v) || v;

// Util
export const exists = a => a !== undefined && a !== null;
export const id = x => x;
export const or = fallback => v => (exists(v) ? v : fallback);
export const no = () => false;
export const yes = () => true;

// Predicates
export const gt = b => a => a > b;
export const gte = b => a => a >= b;
export const is = a => b => a === b;
export const isNumber = n => typeof n === "number";
export const isString = n => typeof n === "string";
export const isEven = n => isNumber(n) && n % 2 === 0;
export const isOdd = n => isNumber(n) && n % 2 !== 0;
export const lt = b => a => a < b;
export const lte = b => a => a <= b;

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
export const forEach = (...funcs) => arr => sA(arr).forEach(Pipe(...funcs));
export const includes = thing => arr => sA(arr).includes(thing);
export const indexOf = term => arr => sA(arr).indexOf(term);
export const join = sep => arr => sA(arr).join(sep);
export const length = arr => sA(arr).length;
export const map = (...funcs) => arr => sA(arr).map(Pipe(...funcs));
export const reduce = (reducer, initial, map, filter) =>
  map ? mapFilterReduce(reducer, initial, map, filter) : plainReduce(reducer, initial);
export const reverse = arr => sA(arr).reverse();
export const slice = (begin, end) => arr => sA(arr).slice(begin, end);
export const some = func => arr => sA(arr).some(func);
export const sort = func => arr => sA(arr).sort(func);
export const sortBy = key =>
  sort((a, b) => {
    const A = (a || {})[key];
    const B = (b || {})[key];
    return lt(B)(A) ? -1 : gt(B)(A) ? 1 : 0;
  });

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
export const get = (...keys) => obj => reduce(key => a => (a || {})[key], obj)(keys);
export const has = (...keys) => Pipe(get(...keys), exists);
export const objectFromEntry = ([k, v]) => ({ [k]: v });
// TODO: test:
export const mapEntry = (...mapKey) => (...mapValue) => ([k, v]) => [
  Pipe(...mapKey)(k),
  Pipe(...mapValue)(v)
];
export const mapObject = (map, filter) =>
  Pipe(Object.entries, reduce(assign, {}, Pipe(map, objectFromEntry), filter));

const abc = { a: { b: { c: 1 } } };
console.log(get("a", "b", "c")(abc));

const { log } = console;
log(reduce(add, 1)([1, 2, 3]));
log(reduce(concat, [])([[1], [2], [3]]));
log(reduce(concat, [], Pipe(add(1), multiply(2)), isEven)([1, 2, 3]));

map(add(1), multiply(2))([1, 2, 3]);
[1, 2, 3].reduce((a, c) => a.concat((c + 1) * 2), []);

// TODO: test
const isAtKey = (key, predicate) => Pipe(get(key), predicate);
const isAtIndex = (index, predicate) => arr => predicate(sA(arr)[index]);

const o = { a: 1, b: 2, c: 3, d: 4, e: "5", 6: 6, 7: "a" };

const squareValues = Pipe(mapEntry(id)(pow(2)), objectFromEntry);
const valueIsNumber = isAtKey(1, isNumber);
const keyIsString = isAtKey(0, n => isNaN(Number(n)));

const b = map(get("a"))([o, o, o]);

log(b);

const a = reduce(assign, {}, squareValues, isAll(keyIsString, valueIsNumber))(
  Object.entries(o)
);

log(a);

const incrementEvenValues = mapObject(mapEntry(id)(add(1)), isAtIndex(1, isEven));
log(incrementEvenValues({ a: 1, b: 2, c: 3, d: 4 })); // { a_new: 2, b_new: 3, c_new: 4 }

// prettier-ignore
mapObject(
  Pipe(
    get("node"),
    mapEntry(get("key", "name"), get("value"))
  )
)({});
