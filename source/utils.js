export const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);

export const not = predicate => (...args) => !predicate(...args);

const throwError = error => {
  throw error;
};
const assertType = (type, label) => value =>
  typeof value !== type ? throwError(new TypeError(label)) : value;

const assertString = assertType("string", "path must be a string");
// eslint-disable-next-line no-unused-vars
export const get = (path, defaultValue) => obj => {
  const sep = assertString(path).startsWith("[") || path === "" ? "" : ".";
  try {
    const result = eval(`obj${sep}${path}`);
    return result === undefined ? defaultValue : result;
  } catch {
    return defaultValue;
  }
};

// eslint-disable-next-line no-console
export const trace = (label = "") => v => console.log(label, v) || v;

const matchError = index => `Non-function passed to 'match[${index}]'`;

export const match = (...patterns) => v => {
  if (patterns.length === 0) throw new TypeError("No patterns passed to 'match'");

  patterns.forEach(([p, m], index) => {
    assertType("function", matchError(index))(p);
    assertType("function", matchError(index))(m);
  });

  const result = patterns.find(([predicate]) => predicate(v));
  return result ? (([_, map]) => map(v))(result) : undefined;
};

// To be used in combination with 'match'
export const otherwise = () => true;
