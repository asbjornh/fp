import * as rawFuncs from "./raw";

function Placeholder() {}
const _ = new Placeholder();

const withPlaceholder = func => (...args) => {
  const pl = args.map(arg => arg instanceof Placeholder);

  if (pl.includes(true)) {
    return (...moreArgs) => {
      const finalArgs = pl.map((isPlaceholder, index) =>
        isPlaceholder ? moreArgs.shift() : args[index]
      );
      return func(...finalArgs);
    };
  }

  return func(...args);
};

const funcsWithPlaceholder = Object.entries(rawFuncs).reduce(
  (accum, [key, func]) => ({
    ...accum,
    [key]: withPlaceholder(func)
  }),
  {}
);

export default {
  ...funcsWithPlaceholder,
  _
};
