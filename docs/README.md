# Kompis API
- <a href="#Pipe">Pipe</a>
- <a href="#not">not</a>
- <a href="#get">get</a>
- <a href="#trace">trace</a>
- <a href="#match">match</a>
- <a href="#otherwise">otherwise</a>
- <a href="#exists">exists</a>
- <a href="#id">id</a>
- <a href="#or">or</a>
- <a href="#no">no</a>
- <a href="#noop">noop</a>
- <a href="#yes">yes</a>
- <a href="#mapIf">mapIf</a>
- <a href="#gt">gt</a>
- <a href="#gte">gte</a>
- <a href="#lt">lt</a>
- <a href="#lte">lte</a>
- <a href="#is">is</a>
- <a href="#isNumber">isNumber</a>
- <a href="#isString">isString</a>
- <a href="#isEven">isEven</a>
- <a href="#isOdd">isOdd</a>
- <a href="#isAtPath">isAtPath</a>
- <a href="#isAtIndex">isAtIndex</a>
- <a href="#isAll">isAll</a>
- <a href="#isSome">isSome</a>
- <a href="#charCodeAt">charCodeAt</a>
- <a href="#endsWith">endsWith</a>
- <a href="#fromCharCode">fromCharCode</a>
- <a href="#padEnd">padEnd</a>
- <a href="#padStart">padStart</a>
- <a href="#repeat">repeat</a>
- <a href="#replace">replace</a>
- <a href="#split">split</a>
- <a href="#startsWith">startsWith</a>
- <a href="#substring">substring</a>
- <a href="#toLowerCase">toLowerCase</a>
- <a href="#toUpperCase">toUpperCase</a>
- <a href="#trim">trim</a>
- <a href="#array">array</a>
- <a href="#concat">concat</a>
- <a href="#concatRight">concatRight</a>
- <a href="#every">every</a>
- <a href="#filter">filter</a>
- <a href="#find">find</a>
- <a href="#findIndex">findIndex</a>
- <a href="#forEach">forEach</a>
- <a href="#includes">includes</a>
- <a href="#indexOf">indexOf</a>
- <a href="#join">join</a>
- <a href="#length">length</a>
- <a href="#map">map</a>
- <a href="#reverse">reverse</a>
- <a href="#slice">slice</a>
- <a href="#some">some</a>
- <a href="#sort">sort</a>
- <a href="#sortBy">sortBy</a>
- <a href="#plainReduce">plainReduce</a>
- <a href="#mapFilterReduce">mapFilterReduce</a>
- <a href="#reduce">reduce</a>
- <a href="#int">int</a>
- <a href="#float">float</a>
- <a href="#toFixed">toFixed</a>
- <a href="#add">add</a>
- <a href="#divide">divide</a>
- <a href="#multiply">multiply</a>
- <a href="#subtract">subtract</a>
- <a href="#max">max</a>
- <a href="#min">min</a>
- <a href="#clamp">clamp</a>
- <a href="#pow">pow</a>
- <a href="#rangeMap">rangeMap</a>
- <a href="#assign">assign</a>
- <a href="#has">has</a>
- <a href="#objectFromEntry">objectFromEntry</a>
- <a href="#mapEntry">mapEntry</a>
- <a href="#mapObject">mapObject</a>

## <a id="Pipe"></a> Pipe


```ts
Pipe: (...funcs: any[]) => (value: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value)
```
  <p>
</details>

Creates a pipeline. `funcs` are composed left to right

```js
const addTwoAndDouble = Pipe(add(2), multiply(2));
addTwoAndDouble(1); // 6
[1, 2].map(addTwoAndDouble); // [6, 8]

```

## <a id="not"></a> not


```ts
not: (predicate: any) => (...args: any[]) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const not = predicate => (...args) => !predicate(...args)
```
  <p>
</details>

Negates the result of a `predicate` 

```js
const isNotString = not(isString);
isString("hello"); // true
isNotString("hello"); // false

```

## <a id="get"></a> get


```ts
get: (path: string, defaultValue?: any) => (obj: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const get = (path: string, defaultValue?) => obj => {
  const sep = assertString(path).startsWith("[") || path === "" ? "" : ".";
  try {
    const result = eval(`obj${sep}${path}`);
    return result === undefined ? defaultValue : result;
  } catch {
    return defaultValue;
  }
}
```
  <p>
</details>

Safely access properties of objects and arrays (like `lodash.get` ).

```js
const person = { name: { last: "a" } };
get("name.last")(person); // "a"
get("name.first", "b")(person); // "b"
get("[1]")([1, 2]); // 2

```

## <a id="trace"></a> trace


```ts
trace: (label?: string) => (v: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const trace = (label = "") => v => {
  console.log(label, v);
  return v;
}
```
  <p>
</details>

Logs `v` to the console and returns `v` .

```js
Pipe(
  add(2),
  trace("after add:"), // logs "after add: 3" to the console
  multiply(2),
  trace("after multiply:") // Logs "after multilpy: 6" to the console
)(1);

```

## <a id="match"></a> match


```ts
match: (...patterns: [(v: any) => boolean, (v: any) => any][]) => (x: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const match = (...patterns: [(v: any) => boolean, (v: any) => any][]) => x => {
  if (patterns.length === 0) throw new TypeError("No patterns passed to 'match'");

  patterns.forEach(([p, m], index) => {
    assertType("function", matchError(index))(p);
    assertType("function", matchError(index))(m);
  });

  const result = patterns.find(([predicate]) => predicate(x));
  return result ? (([_, map]) => map(x))(result) : undefined;
}
```
  <p>
</details>

Takes any number of pairs of [predicate, mapper]. When a match is found for `x` , returns the result of the associated mapper applied to `x` . `otherwise` can be used as a fallback pattern (must be the last pattern).


```js
const matcher = match(
  [isEven, x => `${x} is even!`],
  [isOdd, x => `${x} is odd!`],
  [otherwise, x => `${x} is not a number :/`]
);

matcher(1); // "1 is odd!"
matcher(2); // "2 is even!"
matcher("a"); // a is not a number :/

```If you use `match` recursively you'll get a maximum call stack exceeded error. To avoid this, execute `match` with a value explicitly if you need recursion:


```js
// This will always create a maximum call stack exceeded error
const badMatch = match([somePredicate, badMatch], [otherwise, n => n]);

// This won't
const goodMatch = value => match([somePredicate, goodMatch], [otherwise, n => n])(value);

```

## <a id="otherwise"></a> otherwise


```ts
otherwise: () => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const otherwise = () => true
```
  <p>
</details>



## <a id="exists"></a> exists


```ts
exists: (x: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const exists = x => x !== undefined && x !== null
```
  <p>
</details>

Compares to `null` and `undefined` 

## <a id="id"></a> id


```ts
id: (x: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const id = x => x
```
  <p>
</details>

Identity function

## <a id="or"></a> or


```ts
or: (fallback: any) => (x: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const or = fallback => x => (exists(x) ? x : fallback)
```
  <p>
</details>

Returns `x` if it exists. Otherwise returns `fallback` 

## <a id="no"></a> no


```ts
no: () => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const no = () => false
```
  <p>
</details>

Always returns `false` 

## <a id="noop"></a> noop


```ts
noop: () => void
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const noop = () => {}
```
  <p>
</details>

Always returns `undefined` 

## <a id="yes"></a> yes


```ts
yes: () => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const yes = () => true
```
  <p>
</details>

Always returns `true` 

## <a id="mapIf"></a> mapIf


```ts
mapIf: (predicate: any, ifFunc?: (x: any) => any, elseFunc?: (x: any) => any) => (v: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const mapIf = (predicate, ifFunc = id, elseFunc = id) => v =>
  predicate(v) ? ifFunc(v) : elseFunc(v)
```
  <p>
</details>

Runs the `ifFunc` or the `elseFunc` based on the result of `predicate(v)` 

## <a id="gt"></a> gt


```ts
gt: (b: any) => (a: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const gt = b => a => a > b
```
  <p>
</details>

Is `a` greater than `b` ?

## <a id="gte"></a> gte


```ts
gte: (b: any) => (a: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const gte = b => a => a >= b
```
  <p>
</details>

Is `a` greater than or equal to `b` ?

## <a id="lt"></a> lt


```ts
lt: (b: any) => (a: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const lt = b => a => a < b
```
  <p>
</details>

Is `a` less than `b` ?

## <a id="lte"></a> lte


```ts
lte: (b: any) => (a: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const lte = b => a => a <= b
```
  <p>
</details>

Is `a` less than or equal to `b` ?

## <a id="is"></a> is


```ts
is: (a: any) => (b: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const is = a => b => a === b
```
  <p>
</details>

Is `a` equal to `b` ?

## <a id="isNumber"></a> isNumber


```ts
isNumber: (n: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isNumber = n => typeof n === "number"
```
  <p>
</details>



## <a id="isString"></a> isString


```ts
isString: (n: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isString = n => typeof n === "string"
```
  <p>
</details>



## <a id="isEven"></a> isEven


```ts
isEven: (n: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isEven = n => isNumber(n) && n % 2 === 0
```
  <p>
</details>



## <a id="isOdd"></a> isOdd


```ts
isOdd: (n: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isOdd = n => isNumber(n) && n % 2 !== 0
```
  <p>
</details>



## <a id="isAtPath"></a> isAtPath


```ts
isAtPath: (path: any, predicate: any) => (v: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isAtPath = (path, predicate) => v => predicate(get(path)(v))
```
  <p>
</details>



## <a id="isAtIndex"></a> isAtIndex


```ts
isAtIndex: (index: any, predicate: any) => (v: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isAtIndex = (index, predicate) => isAtPath(`[${index}]`, predicate)
```
  <p>
</details>



## <a id="isAll"></a> isAll


```ts
isAll: (...predicates: any[]) => (v: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isAll = (...predicates) => v =>
  predicates.reduce((a, pred) => a && pred(v), predicates.length ? true : false)
```
  <p>
</details>

Checks whether the `v` fulfils all the `predicates` 

## <a id="isSome"></a> isSome


```ts
isSome: (...predicates: any[]) => (v: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isSome = (...predicates) => v =>
  predicates.reduce((a, pred) => a || pred(v), false)
```
  <p>
</details>

Checks whether the `v` fulfils some of the `predicates` 

## <a id="charCodeAt"></a> charCodeAt


```ts
charCodeAt: (index: any) => (str: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const charCodeAt = index => str => sS(str).charCodeAt(index)
```
  <p>
</details>



## <a id="endsWith"></a> endsWith


```ts
endsWith: (term: any) => (str: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const endsWith = term => str => sS(str).endsWith(term)
```
  <p>
</details>



## <a id="fromCharCode"></a> fromCharCode


```ts
fromCharCode: (num: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const fromCharCode = num => String.fromCharCode(num)
```
  <p>
</details>



## <a id="padEnd"></a> padEnd


```ts
padEnd: (length: any, char: any) => (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const padEnd = (length, char) => str => sS(str).padEnd(length, char)
```
  <p>
</details>



## <a id="padStart"></a> padStart


```ts
padStart: (length: any, char: any) => (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const padStart = (length, char) => str => sS(str).padStart(length, char)
```
  <p>
</details>



## <a id="repeat"></a> repeat


```ts
repeat: (length: any) => (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const repeat = length => str => sS(str).repeat(length)
```
  <p>
</details>



## <a id="replace"></a> replace


```ts
replace: (regexp: any, newStr: any) => (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const replace = (regexp, newStr) => str => sS(str).replace(regexp, newStr)
```
  <p>
</details>



## <a id="split"></a> split


```ts
split: (sep: any) => (str: any) => string[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const split = sep => str => sS(str).split(sep)
```
  <p>
</details>



## <a id="startsWith"></a> startsWith


```ts
startsWith: (term: any) => (str: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const startsWith = term => str => sS(str).startsWith(term)
```
  <p>
</details>



## <a id="substring"></a> substring


```ts
substring: (start: any, end: any) => (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const substring = (start, end) => str => sS(str).substring(start, end)
```
  <p>
</details>



## <a id="toLowerCase"></a> toLowerCase


```ts
toLowerCase: (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const toLowerCase = str => sS(str).toLowerCase()
```
  <p>
</details>



## <a id="toUpperCase"></a> toUpperCase


```ts
toUpperCase: (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const toUpperCase = str => sS(str).toUpperCase()
```
  <p>
</details>



## <a id="trim"></a> trim


```ts
trim: (str: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const trim = str => sS(str).trim()
```
  <p>
</details>



## <a id="array"></a> array


```ts
array: (range?: number, mapper?: (x: any) => any, filter?: (v: any) => boolean) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const array = (range = 0, mapper = id, filter = v => true): any[] =>
  new Array(range).fill(0).reduce((a, _, i) => a.concat(filter(i) ? mapper(i) : []), [])
```
  <p>
</details>

Creates an array. Kind of similar to list comprehension in python

```js
array(5); // [0, 1, 2, 3, 4, 5]
array(5, add(1), isEven); // [0, 3, 5]

```

## <a id="concat"></a> concat


```ts
concat: (b: any) => (a: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const concat = b => a => ensureArray(a).concat(ensureArray(b))
```
  <p>
</details>

Concatenates `b` into `a` . Does not concat `undefined` or `null` 

```js
concat(2)([1]); // [1, 2]

```

## <a id="concatRight"></a> concatRight


```ts
concatRight: (a: any) => (b: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const concatRight = a => b => ensureArray(a).concat(ensureArray(b))
```
  <p>
</details>

Concatenates `a` into `b` . Does not concat `undefined` or `null` 

```js
concat([1])(2); // [1, 2]

```

## <a id="every"></a> every


```ts
every: (func: any) => (arr: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const every = func => arr => sA(arr).every(func)
```
  <p>
</details>



## <a id="filter"></a> filter


```ts
filter: (func: any) => (arr: any) => {}[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const filter = func => arr => sA(arr).filter(func)
```
  <p>
</details>



## <a id="find"></a> find


```ts
find: (func: any) => (arr: any) => {} | undefined
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const find = func => arr => sA(arr).find(func)
```
  <p>
</details>



## <a id="findIndex"></a> findIndex


```ts
findIndex: (func: any) => (arr: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const findIndex = func => arr => sA(arr).findIndex(func)
```
  <p>
</details>



## <a id="forEach"></a> forEach


```ts
forEach: (...funcs: any[]) => (arr: any) => void
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const forEach = (...funcs) => arr => sA(arr).forEach(Pipe(...funcs))
```
  <p>
</details>



## <a id="includes"></a> includes


```ts
includes: (thing: any) => (arr: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const includes = thing => arr => sA(arr).includes(thing)
```
  <p>
</details>



## <a id="indexOf"></a> indexOf


```ts
indexOf: (term: any) => (arr: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const indexOf = term => arr => sA(arr).indexOf(term)
```
  <p>
</details>



## <a id="join"></a> join


```ts
join: (sep: string) => (arr: any) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const join = (sep: string) => arr => sA(arr).join(sep)
```
  <p>
</details>



## <a id="length"></a> length


```ts
length: (arr: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const length = arr => sA(arr).length
```
  <p>
</details>



## <a id="map"></a> map


```ts
map: (...funcs: any[]) => (arr: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const map = (...funcs) => arr => sA(arr).map(Pipe(...funcs))
```
  <p>
</details>



## <a id="reverse"></a> reverse


```ts
reverse: (arr: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const reverse = arr => sA(arr).reverse()
```
  <p>
</details>



## <a id="slice"></a> slice


```ts
slice: (begin: any, end: any) => (arr: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const slice = (begin, end) => arr => sA(arr).slice(begin, end)
```
  <p>
</details>



## <a id="some"></a> some


```ts
some: (func: any) => (arr: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const some = func => arr => sA(arr).some(func)
```
  <p>
</details>



## <a id="sort"></a> sort


```ts
sort: (func: any) => (arr: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const sort = func => arr => sA(arr).sort(func)
```
  <p>
</details>



## <a id="sortBy"></a> sortBy


```ts
sortBy: (path?: string) => (arr: any) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const sortBy = (path = "") =>
  sort((a, b) => {
    const A = get(path)(a);
    const B = get(path)(b);
    return lt(B)(A) ? -1 : gt(B)(A) ? 1 : 0;
  })
```
  <p>
</details>

Sort objects or arrays by key or index (or both)

```js
sortBy("a[0]")([{ a: [3] }, { a: [2] }, { a: [1] }]);
// [{ a: [1] }, { a: [2] }, { a: [3] }]

```

## <a id="plainReduce"></a> plainReduce


```ts
plainReduce: (func: any, initial: any) => (arr: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const plainReduce = (func, initial) => arr =>
  sA(arr).reduce((a, c) => func(c)(a), initial)
```
  <p>
</details>

See `reduce` for documentation

## <a id="mapFilterReduce"></a> mapFilterReduce


```ts
mapFilterReduce: (reducer: any, initial: any, map: any, filter?: (v: any) => boolean) => (arr: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const mapFilterReduce = (reducer, initial, map, filter = v => true) => arr =>
  sA(arr).reduce((a, c) => (filter(c) ? reducer(map(c))(a) : a), initial)
```
  <p>
</details>

See `reduce` for documentation

## <a id="reduce"></a> reduce


```ts
reduce: (reducer: any, initial: any, map: any, filter: any) => (arr: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const reduce = (reducer, initial, map, filter) =>
  map ? mapFilterReduce(reducer, initial, map, filter) : plainReduce(reducer, initial)
```
  <p>
</details>

Note that `reducer` needs to be a higher order unary function (returning another unary function) and that the order of the current and accumulator are reversed. This makes it possible to use other functions from this package as the `reducer` .


```js
reduce(curr => accum => accum + curr, 0)([1, 2, 3]); // 6
reduce(add, 0)([1, 2, 3]); // 6
reduce(concat, [])([[1, 2], [3, 4]]); // [1, 2, 3, 4]

```
 `map` and `filter` can be used to do many operations that otherwise would require iterating over a list many times, like `[].filter(fn).map(fn).reduce(fn)` which can be orders of magnitude slower. Filtering happens before mapping.


```js
const numbers = [1, 2, 3, 4];

// 4 iterations
reduce(add, 0, pow(2), isEven)(numbers); // 20

// 4 + 2 + 2 iterations
Pipe(filter(isEven), map(pow(2)), reduce(add))(numbers); // 20

```

## <a id="int"></a> int


```ts
int: (n: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const int = n => parseInt(n)
```
  <p>
</details>

Unary version of parseInt (can safely be used in `map` etc)

## <a id="float"></a> float


```ts
float: (n: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const float = n => parseFloat(n)
```
  <p>
</details>

Unary version of parseFloat (can safely be used in `map` etc)

## <a id="toFixed"></a> toFixed


```ts
toFixed: (digits: number) => (num: number) => string
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const toFixed = (digits: number) => (num: number) =>
  isNumber(num) ? num.toFixed(digits) : ""
```
  <p>
</details>



## <a id="add"></a> add


```ts
add: (b: any) => (a: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const add = b => a => a + b
```
  <p>
</details>



## <a id="divide"></a> divide


```ts
divide: (b: any) => (a: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const divide = b => a => a / b
```
  <p>
</details>



## <a id="multiply"></a> multiply


```ts
multiply: (b: any) => (a: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const multiply = b => a => a * b
```
  <p>
</details>



## <a id="subtract"></a> subtract


```ts
subtract: (b: any) => (a: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const subtract = b => a => a - b
```
  <p>
</details>



## <a id="max"></a> max


```ts
max: (arr: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const max = arr => Math.max(...arr)
```
  <p>
</details>



## <a id="min"></a> min


```ts
min: (arr: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const min = arr => Math.min(...arr)
```
  <p>
</details>



## <a id="clamp"></a> clamp


```ts
clamp: (min: any, max: any) => (n: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const clamp = (min, max) => n => Math.min(max, Math.max(min, n))
```
  <p>
</details>



## <a id="pow"></a> pow


```ts
pow: (exp: any) => (base: any) => number
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const pow = exp => base => Math.pow(base, exp)
```
  <p>
</details>



## <a id="rangeMap"></a> rangeMap


```ts
rangeMap: (inMin: any, inMax: any, outMin: any, outMax: any) => (n: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const rangeMap = (inMin, inMax, outMin, outMax) => n =>
  ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
```
  <p>
</details>



## <a id="assign"></a> assign


```ts
assign: (b: any) => (a: any) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const assign = b => a => Object.assign({}, a, b)
```
  <p>
</details>



## <a id="has"></a> has


```ts
has: (path?: string) => (obj: any) => boolean
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const has = (path = "") => obj => exists(get(path)(obj))
```
  <p>
</details>

Checks whether `obj` has a value at the given `path` . Not to be confused with `object.hasOwnProperty` 

## <a id="objectFromEntry"></a> objectFromEntry


```ts
objectFromEntry: ([k, v]?: [(string | undefined)?, any?]) => { [x: string]: any; }
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const objectFromEntry = ([k, v]: Entry = []) => (k ? { [k]: v } : {})
```
  <p>
</details>



## <a id="mapEntry"></a> mapEntry


```ts
mapEntry: (mapKey: any, mapValue: any) => ([k, v]?: [(string | undefined)?, any?]) => any[]
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const mapEntry = (mapKey, mapValue) => ([k, v]: Entry = []) => [
  mapKey(k),
  mapValue(v)
]
```
  <p>
</details>



## <a id="mapObject"></a> mapObject


```ts
mapObject: (map: any, filter: any) => (obj?: {}) => any
```

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const mapObject = (map, filter) => (obj = {}) =>
  reduce(assign, {}, Pipe(map, objectFromEntry), filter)(Object.entries(obj))
```
  <p>
</details>


