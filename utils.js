export const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value);

export const get = (keys, defaultValue) => obj => {
  const result = [].concat(keys).reduce((a, key) => (a || {})[key], obj);

  return result !== undefined && result !== null ? result : defaultValue;
};

// eslint-disable-next-line no-console
export const trace = v => console.log(v) || v;

const assertFn = (label, func) => {
  if (typeof func !== "function") {
    throw new TypeError(`Non-function passed to '${label}'`);
  }

  return func;
};

export const match = (...patterns) => v => {
  if (patterns.length === 0) throw new TypeError("No patterns passed to 'match'");

  patterns.forEach(([p, m], index) => {
    assertFn(`match[${index}]`, p);
    assertFn(`match[${index}]`, m);
  });

  const result = patterns.find(([predicate]) => predicate(v));
  return result ? (([_, map]) => map(v))(result) : undefined;
};

// To be used in combination with 'match'
export const otherwise = () => true;
