import test from "ava";

import { isEven, isOdd, isString, otherwise, match } from "../source/index";

test("Happy path", t => {
  const matcher = match(
    [isEven, () => true],
    [isOdd, () => false],
    [isString, () => null]
  );

  t.is(true, matcher(2));
  t.is(false, matcher(1));
  t.is(null, matcher("a"));
  t.is(undefined, matcher(null));
});

test("With fallback", t => {
  const matcher = match(
    [isEven, () => true],
    [isOdd, () => false],
    [otherwise, () => "No match"]
  );

  t.is(true, matcher(2));
  t.is(false, matcher(1));
  t.is("No match", matcher("a"));
  t.is("No match", matcher(null));
});

test("Throws on non-function", t => {
  const error1 = t.throws(() => {
    match([isEven, null])(1);
  });

  const error2 = t.throws(() => {
    match([true, n => n])(1);
  });

  const error3 = t.throws(() => {
    match([])(1);
  });

  const error4 = t.throws(() => {
    match()(1);
  });

  t.is("Non-function passed to 'match[0]'", error1.message);
  t.is("Non-function passed to 'match[0]'", error2.message);
  t.is("Non-function passed to 'match[0]'", error3.message);
  t.is("No patterns passed to 'match'", error4.message);
});
