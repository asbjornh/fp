import test from "ava";

import {
  add,
  charCodeAt,
  fromCharCode,
  join,
  map,
  makePipe,
  pipe,
  subtract
} from "../index";

test("pipe", t => {
  const result = pipe(
    [0, 1, 2],
    map(add(65)),
    map(fromCharCode),
    join("")
  );
  t.is("ABC", result);
});

test("makePipe", t => {
  const myPipe = makePipe(map(makePipe(charCodeAt(0), subtract(65))), join(""));
  const result = myPipe(["A", "B", "C", "D"]);
  t.is("0123", result);
});
