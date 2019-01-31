export const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);

const assertType = (type, label) => value => {
  if (typeof value !== type) {
    throw new TypeError(label);
  }

  return value;
};

const assertString = assertType("string", "get: path argument must be a string");
// eslint-disable-next-line no-unused-vars
export const get = (path, defaultValue) => obj => {
  assertString(path);
  const sep = path.startsWith("[") || path === "" ? "" : ".";
  try {
    return eval(`obj${sep}${path}`);
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
