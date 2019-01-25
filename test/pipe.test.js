import test from "ava";

import { charCodeAt, join, map, Pipe, subtract } from "../index";

test("Pipe", t => {
  const myMap = Pipe(charCodeAt(0), subtract(65));
  const myPipe = Pipe(map(myMap), join(""));
  const result = myPipe(["A", "B", "C", "D"]);
  t.is("0123", result);
});
