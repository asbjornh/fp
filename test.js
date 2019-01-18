import * as raw from "./index";

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

export default Object.entries(raw).reduce(
  (accum, [key, func]) => ({
    ...accum,
    [key]: func.length > 1 ? withPlaceholder(func) : func
  }),
  {}
);

const addThree = withPlaceholder((a, b, c) => a - b - c);

console.log(addThree(3, _, _)(2, 1));
console.log(addThree(1, 2, 3));
