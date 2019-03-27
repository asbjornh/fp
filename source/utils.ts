/** Creates a pipeline. `funcs` are composed left to right
```js
const addTwoAndDouble = Pipe(add(2), multiply(2));
addTwoAndDouble(1); // 6
[1, 2].map(addTwoAndDouble); // [6, 8]
```
*/
export const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);

/** Negates the result of a `predicate`
```js
const isNotString = not(isString);
isString("hello"); // true
isNotString("hello"); // false
```
 */
export const not = predicate => (...args) => !predicate(...args);

const throwError = error => {
  throw error;
};
const assertType = (type, label) => value =>
  typeof value !== type ? throwError(new TypeError(label)) : value;

const assertString = assertType("string", "path must be a string");

/** Safely access properties of objects and arrays (like `lodash.get`).
```js
const person = { name: { last: "a" } };
get("name.last")(person); // "a"
get("name.first", "b")(person); // "b"
get("[1]")([1, 2]); // 2
```
*/
export const get = (path: string, defaultValue?) => obj => {
  const sep = assertString(path).startsWith("[") || path === "" ? "" : ".";
  try {
    const result = eval(`obj${sep}${path}`);
    return result === undefined ? defaultValue : result;
  } catch {
    return defaultValue;
  }
};

/** Logs `v` to the console and returns `v`.
```js
Pipe(
  add(2),
  trace("after add:"), // logs "after add: 3" to the console
  multiply(2),
  trace("after multiply:") // Logs "after multilpy: 6" to the console
)(1);
```
*/
// eslint-disable-next-line no-console
export const trace = (label = "") => v => {
  console.log(label, v);
  return v;
};

const matchError = index => `Non-function passed to 'match[${index}]'`;

/** Takes any number of pairs of [predicate, mapper]. When a match is found for `x`, returns the result of the associated mapper applied to `x`. `otherwise` can be used as a fallback pattern (must be the last pattern).

```js
const matcher = match(
  [isEven, x => `${x} is even!`],
  [isOdd, x => `${x} is odd!`],
  [otherwise, x => `${x} is not a number :/`]
);

matcher(1); // "1 is odd!"
matcher(2); // "2 is even!"
matcher("a"); // a is not a number :/
```
If you use `match` recursively you'll get a maximum call stack exceeded error. To avoid this, execute `match` with a value explicitly if you need recursion:

```js
// This will always create a maximum call stack exceeded error
const badMatch = match([somePredicate, badMatch], [otherwise, n => n]);

// This won't
const goodMatch = value => match([somePredicate, goodMatch], [otherwise, n => n])(value);
```
 */
export const match = (...patterns: [(v: any) => boolean, (v: any) => any][]) => x => {
  if (patterns.length === 0) throw new TypeError("No patterns passed to 'match'");

  patterns.forEach(([p, m], index) => {
    assertType("function", matchError(index))(p);
    assertType("function", matchError(index))(m);
  });

  const result = patterns.find(([predicate]) => predicate(x));
  return result ? (([_, map]) => map(x))(result) : undefined;
};

// To be used in combination with 'match'
export const otherwise = () => true;
