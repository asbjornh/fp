export const curry = func => (...args) =>
  args.length >= func.length || func.length === 1
    ? func(...args)
    : args.length
    ? curry(func.bind(null, ...args))
    : curry(func.bind(null, undefined));

export const makePipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);
export const pipe = (value, ...funcs) => makePipe(...funcs)(value);

// eslint-disable-next-line no-console
export const trace = v => console.log(v) || v;

// Util
export const exists = a => a !== undefined && a !== null;
export const id = x => x;
export const or = curry((fallback, v) => (exists(v) ? v : fallback));
export const no = () => false;
export const yes = () => true;

// Comparison
export const gt = curry((b, a) => a > b);
export const gte = curry((b, a) => a >= b);
export const is = curry((a, b) => a === b);
export const isEven = n => n % 2 === 0;
export const isOdd = n => !isEven(n);
export const lt = curry((b, a) => a < b);
export const lte = curry((b, a) => a <= b);

// String
export const charCodeAt = curry((index, str) => (str || "").charCodeAt(index));
export const endsWith = curry((term, str) => (str || "").endsWith(term));
export const fromCharCode = num => String.fromCharCode(num);
export const match = curry((regexp, str) => (str || "").match(regexp));
export const padEnd = curry((length, char, str) => (str || "").padEnd(length, char));
export const padStart = curry((length, char, str) => (str || "").padStart(length, char));
export const repeat = curry((length, str) => (str || "").repeat(length));
export const replace = curry((regexp, newStr, str) =>
  (str || "").replace(regexp, newStr)
);
export const split = curry((sep, str) => (str || "").split(sep));
export const startsWith = curry((term, str) => (str || "").startsWith(term));
export const substring = curry((start, end, str) => (str || "").substring(start, end));
export const toLowerCase = str => (str || "").toLowerCase();
export const toUpperCase = str => (str || "").toUpperCase();
export const trim = str => (str || "").trim();

// Array
export const array = (length = 0, mapper = id, filter = yes) =>
  new Array(length).fill(0).reduce((a, _, i) => a.concat(filter(i) ? mapper(i) : []), []);
export const concat = curry((b, a) => (a || []).concat(b || []));
export const concatRight = curry((a, b) => (a || []).concat(b || []));
export const every = curry((func, arr) => (arr || []).every(func));
export const filter = curry((func, arr) => (arr || []).filter(func));
export const find = curry((func, arr) => (arr || []).find(func));
export const findIndex = curry((func, arr) => (arr || []).findIndex(func));
export const forEach = curry((func, arr) => (arr || []).forEach(func));
export const includes = curry((thing, arr) => (arr || []).includes(thing));
export const indexOf = curry((term, arr) => (arr || []).indexOf(term));
export const join = curry((sep, arr) => (arr || []).join(sep));
export const length = arr => (arr || []).length;
export const map = curry((func, arr) => (arr || []).map(func));
export const reduce = curry((func, initial, arr) => (arr || []).reduce(func, initial));
export const reduceRight = curry((func, initial, arr) =>
  (arr || []).reduceRight(func, initial)
);
export const reverse = arr => (arr || []).reverse();
export const slice = curry((begin, end, arr) => (arr || []).slice(begin, end));
export const some = curry((func, arr) => (arr || []).some(func));
export const sort = curry((func, arr) => (arr || []).sort(func));
export const sortBy = key => sort((a, b) => (a || {})[key] - (b || {})[key]);

// Number
export const int = n => parseInt(n);
export const float = n => parseFloat(n);
export const toFixed = curry((dec, num) => (num ? num.toFixed(dec) : num));

// Math
export const add = curry((b, a) => a + b);
export const divide = curry((b, a) => a / b);
export const multiply = curry((b, a) => a * b);
export const subtract = curry((b, a) => a - b);

export const max = arr => Math.max(...arr);
export const min = arr => Math.min(...arr);
export const clamp = curry((min, max, n) => Math.min(max, Math.max(min, n)));
export const pow = curry((exp, base) => Math.pow(base, exp));
export const random = (a = 1) => () => a * Math.random();
export const rangeMap = curry(
  (inMin, inMax, outMin, outMax, n) =>
    ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
);
export const sum = reduce(add, 0);

export const radians = deg => (deg * Math.PI) / 180;
export const cos = deg => Math.cos(radians(deg));
export const sin = deg => Math.sin(radians(deg));
export const tan = deg => Math.tan(radians(deg));

// Object
export const assign = curry((b, a) => Object.assign({}, a, b));
export const get = curry((key, obj) => (obj || {})[key]);
