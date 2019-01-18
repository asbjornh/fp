const rawFuncs = require("./raw");

const curry = func => (...args) =>
  args.length >= func.length || func.length === 1
    ? func(...args)
    : args.length
    ? curry(func.bind(null, ...args))
    : curry(func.bind(null, undefined));

const curriedFuncs = Object.entries(rawFuncs).reduce(
  (accum, [key, func]) => ({
    ...accum,
    [key]: func.length > 1 ? curry(func) : func
  }),
  {}
);

module.exports = {
  ...curriedFuncs,
  curry
};
