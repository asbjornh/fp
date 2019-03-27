# Kompis API
<details>
  <summary>Table of contents</summary>
  <ul>
    <li><a href="#Pipe">Pipe</a></li>
<li><a href="#not">not</a></li>
<li><a href="#get">get</a></li>
<li><a href="#trace">trace</a></li>
<li><a href="#match">match</a></li>
<li><a href="#otherwise">otherwise</a></li>
<li><a href="#exists">exists</a></li>
<li><a href="#id">id</a></li>
<li><a href="#or">or</a></li>
<li><a href="#no">no</a></li>
<li><a href="#noop">noop</a></li>
<li><a href="#yes">yes</a></li>
<li><a href="#mapIf">mapIf</a></li>
<li><a href="#gt">gt</a></li>
<li><a href="#gte">gte</a></li>
<li><a href="#lt">lt</a></li>
<li><a href="#lte">lte</a></li>
<li><a href="#is">is</a></li>
<li><a href="#isNumber">isNumber</a></li>
<li><a href="#isString">isString</a></li>
<li><a href="#isEven">isEven</a></li>
<li><a href="#isOdd">isOdd</a></li>
<li><a href="#isAtPath">isAtPath</a></li>
<li><a href="#isAtIndex">isAtIndex</a></li>
<li><a href="#isAll">isAll</a></li>
<li><a href="#isSome">isSome</a></li>
<li><a href="#charCodeAt">charCodeAt</a></li>
<li><a href="#endsWith">endsWith</a></li>
<li><a href="#fromCharCode">fromCharCode</a></li>
<li><a href="#padEnd">padEnd</a></li>
<li><a href="#padStart">padStart</a></li>
<li><a href="#repeat">repeat</a></li>
<li><a href="#replace">replace</a></li>
<li><a href="#split">split</a></li>
<li><a href="#startsWith">startsWith</a></li>
<li><a href="#substring">substring</a></li>
<li><a href="#toLowerCase">toLowerCase</a></li>
<li><a href="#toUpperCase">toUpperCase</a></li>
<li><a href="#trim">trim</a></li>
<li><a href="#array">array</a></li>
<li><a href="#concat">concat</a></li>
<li><a href="#concatRight">concatRight</a></li>
<li><a href="#every">every</a></li>
<li><a href="#filter">filter</a></li>
<li><a href="#find">find</a></li>
<li><a href="#findIndex">findIndex</a></li>
<li><a href="#forEach">forEach</a></li>
<li><a href="#includes">includes</a></li>
<li><a href="#indexOf">indexOf</a></li>
<li><a href="#join">join</a></li>
<li><a href="#length">length</a></li>
<li><a href="#map">map</a></li>
<li><a href="#reverse">reverse</a></li>
<li><a href="#slice">slice</a></li>
<li><a href="#some">some</a></li>
<li><a href="#sort">sort</a></li>
<li><a href="#sortBy">sortBy</a></li>
<li><a href="#plainReduce">plainReduce</a></li>
<li><a href="#mapFilterReduce">mapFilterReduce</a></li>
<li><a href="#reduce">reduce</a></li>
<li><a href="#int">int</a></li>
<li><a href="#float">float</a></li>
<li><a href="#toFixed">toFixed</a></li>
<li><a href="#add">add</a></li>
<li><a href="#divide">divide</a></li>
<li><a href="#multiply">multiply</a></li>
<li><a href="#subtract">subtract</a></li>
<li><a href="#max">max</a></li>
<li><a href="#min">min</a></li>
<li><a href="#clamp">clamp</a></li>
<li><a href="#pow">pow</a></li>
<li><a href="#rangeMap">rangeMap</a></li>
<li><a href="#assign">assign</a></li>
<li><a href="#has">has</a></li>
<li><a href="#objectFromEntry">objectFromEntry</a></li>
<li><a href="#mapEntry">mapEntry</a></li>
<li><a href="#mapObject">mapObject</a></li>
  </ul>
</details>

## <div id="Pipe"></div> Pipe


```ts
Pipe: (...funcs: any[]) => (value: any) => any
```


Creates a pipeline. `funcs` are composed left to right

```js
const addTwoAndDouble = Pipe(add(2), multiply(2));
addTwoAndDouble(1); // 6
[1, 2].map(addTwoAndDouble); // [6, 8]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const Pipe = (...funcs) => value => funcs.reduce((a, func) => func(a), value)
```

  <p>
</details>

## <div id="not"></div> not


```ts
not: (predicate: any) => (...args: any[]) => boolean
```


Negates the result of a `predicate` 

```js
const isNotString = not(isString);
isString("hello"); // true
isNotString("hello"); // false

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const not = predicate => (...args) => !predicate(...args)
```

  <p>
</details>

## <div id="get"></div> get


```ts
get: (path: string, defaultValue?: any) => (obj: any) => any
```


Safely access properties of objects and arrays (like `lodash.get` ).

```js
const person = { name: { last: "a" } };
get("name.last")(person); // "a"
get("name.first", "b")(person); // "b"
get("[1]")([1, 2]); // 2

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

## <div id="trace"></div> trace


```ts
trace: (label?: string) => (v: any) => any
```


Logs `v` to the console and returns `v` .

```js
Pipe(
  add(2),
  trace("after add:"), // logs "after add: 3" to the console
  multiply(2),
  trace("after multiply:") // Logs "after multilpy: 6" to the console
)(1);

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

## <div id="match"></div> match


```ts
match: (...patterns: [(v: any) => boolean, (v: any) => any][]) => (x: any) => any
```


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

```
If you use `match` recursively you'll get a maximum call stack exceeded error. To avoid this, execute `match` with a value explicitly if you need recursion:


```js
// This will always create a maximum call stack exceeded error
const badMatch = match([somePredicate, badMatch], [otherwise, n => n]);

// This won't
const goodMatch = value => match([somePredicate, goodMatch], [otherwise, n => n])(value);

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

## <div id="otherwise"></div> otherwise


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

## <div id="exists"></div> exists


```ts
exists: (x: any) => boolean
```


Compares to `null` and `undefined` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const exists = x => x !== undefined && x !== null
```

  <p>
</details>

## <div id="id"></div> id


```ts
id: (x: any) => any
```


Identity function

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const id = x => x
```

  <p>
</details>

## <div id="or"></div> or


```ts
or: (fallback: any) => (x: any) => any
```


Returns `x` if it exists. Otherwise returns `fallback` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const or = fallback => x => (exists(x) ? x : fallback)
```

  <p>
</details>

## <div id="no"></div> no


```ts
no: () => boolean
```


Always returns `false` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const no = () => false
```

  <p>
</details>

## <div id="noop"></div> noop


```ts
noop: () => void
```


Always returns `undefined` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const noop = () => {}
```

  <p>
</details>

## <div id="yes"></div> yes


```ts
yes: () => boolean
```


Always returns `true` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const yes = () => true
```

  <p>
</details>

## <div id="mapIf"></div> mapIf


```ts
mapIf: (predicate: any, ifFunc?: (x: any) => any, elseFunc?: (x: any) => any) => (v: any) => any
```


Runs the `ifFunc` or the `elseFunc` based on the result of `predicate(v)` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const mapIf = (predicate, ifFunc = id, elseFunc = id) => v =>
  predicate(v) ? ifFunc(v) : elseFunc(v)
```

  <p>
</details>

## <div id="gt"></div> gt


```ts
gt: (b: any) => (a: any) => boolean
```


Is `a` greater than `b` ?

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const gt = b => a => a > b
```

  <p>
</details>

## <div id="gte"></div> gte


```ts
gte: (b: any) => (a: any) => boolean
```


Is `a` greater than or equal to `b` ?

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const gte = b => a => a >= b
```

  <p>
</details>

## <div id="lt"></div> lt


```ts
lt: (b: any) => (a: any) => boolean
```


Is `a` less than `b` ?

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const lt = b => a => a < b
```

  <p>
</details>

## <div id="lte"></div> lte


```ts
lte: (b: any) => (a: any) => boolean
```


Is `a` less than or equal to `b` ?

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const lte = b => a => a <= b
```

  <p>
</details>

## <div id="is"></div> is


```ts
is: (a: any) => (b: any) => boolean
```


Is `a` equal to `b` ?

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const is = a => b => a === b
```

  <p>
</details>

## <div id="isNumber"></div> isNumber


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

## <div id="isString"></div> isString


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

## <div id="isEven"></div> isEven


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

## <div id="isOdd"></div> isOdd


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

## <div id="isAtPath"></div> isAtPath


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

## <div id="isAtIndex"></div> isAtIndex


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

## <div id="isAll"></div> isAll


```ts
isAll: (...predicates: any[]) => (v: any) => any
```


Checks whether the `v` fulfils all the `predicates` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isAll = (...predicates) => v =>
  predicates.reduce((a, pred) => a && pred(v), predicates.length ? true : false)
```

  <p>
</details>

## <div id="isSome"></div> isSome


```ts
isSome: (...predicates: any[]) => (v: any) => any
```


Checks whether the `v` fulfils some of the `predicates` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isSome = (...predicates) => v =>
  predicates.reduce((a, pred) => a || pred(v), false)
```

  <p>
</details>

## <div id="charCodeAt"></div> charCodeAt


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

## <div id="endsWith"></div> endsWith


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

## <div id="fromCharCode"></div> fromCharCode


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

## <div id="padEnd"></div> padEnd


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

## <div id="padStart"></div> padStart


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

## <div id="repeat"></div> repeat


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

## <div id="replace"></div> replace


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

## <div id="split"></div> split


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

## <div id="startsWith"></div> startsWith


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

## <div id="substring"></div> substring


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

## <div id="toLowerCase"></div> toLowerCase


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

## <div id="toUpperCase"></div> toUpperCase


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

## <div id="trim"></div> trim


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

## <div id="array"></div> array


```ts
array: (range?: number, mapper?: (x: any) => any, filter?: (v: any) => boolean) => any[]
```


Creates an array. Kind of similar to list comprehension in python

```js
array(5); // [0, 1, 2, 3, 4, 5]
array(5, add(1), isEven); // [0, 3, 5]

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

## <div id="concat"></div> concat


```ts
concat: (b: any) => (a: any) => any[]
```


Concatenates `b` into `a` . Does not concat `undefined` or `null` 

```js
concat(2)([1]); // [1, 2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const concat = b => a => ensureArray(a).concat(ensureArray(b))
```

  <p>
</details>

## <div id="concatRight"></div> concatRight


```ts
concatRight: (a: any) => (b: any) => any[]
```


Concatenates `a` into `b` . Does not concat `undefined` or `null` 

```js
concat([1])(2); // [1, 2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const concatRight = a => b => ensureArray(a).concat(ensureArray(b))
```

  <p>
</details>

## <div id="every"></div> every


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

## <div id="filter"></div> filter


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

## <div id="find"></div> find


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

## <div id="findIndex"></div> findIndex


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

## <div id="forEach"></div> forEach


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

## <div id="includes"></div> includes


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

## <div id="indexOf"></div> indexOf


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

## <div id="join"></div> join


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

## <div id="length"></div> length


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

## <div id="map"></div> map


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

## <div id="reverse"></div> reverse


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

## <div id="slice"></div> slice


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

## <div id="some"></div> some


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

## <div id="sort"></div> sort


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

## <div id="sortBy"></div> sortBy


```ts
sortBy: (path?: string) => (arr: any) => any[]
```


Sort objects or arrays by key or index (or both)

```js
sortBy("a[0]")([{ a: [3] }, { a: [2] }, { a: [1] }]);
// [{ a: [1] }, { a: [2] }, { a: [3] }]

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

## <div id="plainReduce"></div> plainReduce


```ts
plainReduce: (func: any, initial: any) => (arr: any) => any
```


See `reduce` for documentation

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const plainReduce = (func, initial) => arr =>
  sA(arr).reduce((a, c) => func(c)(a), initial)
```

  <p>
</details>

## <div id="mapFilterReduce"></div> mapFilterReduce


```ts
mapFilterReduce: (reducer: any, initial: any, map: any, filter?: (v: any) => boolean) => (arr: any) => any
```


See `reduce` for documentation

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const mapFilterReduce = (reducer, initial, map, filter = v => true) => arr =>
  sA(arr).reduce((a, c) => (filter(c) ? reducer(map(c))(a) : a), initial)
```

  <p>
</details>

## <div id="reduce"></div> reduce


```ts
reduce: (reducer: any, initial: any, map: any, filter: any) => (arr: any) => any
```


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


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const reduce = (reducer, initial, map, filter) =>
  map ? mapFilterReduce(reducer, initial, map, filter) : plainReduce(reducer, initial)
```

  <p>
</details>

## <div id="int"></div> int


```ts
int: (n: any) => number
```


Unary version of parseInt (can safely be used in `map` etc)

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const int = n => parseInt(n)
```

  <p>
</details>

## <div id="float"></div> float


```ts
float: (n: any) => number
```


Unary version of parseFloat (can safely be used in `map` etc)

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const float = n => parseFloat(n)
```

  <p>
</details>

## <div id="toFixed"></div> toFixed


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

## <div id="add"></div> add


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

## <div id="divide"></div> divide


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

## <div id="multiply"></div> multiply


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

## <div id="subtract"></div> subtract


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

## <div id="max"></div> max


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

## <div id="min"></div> min


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

## <div id="clamp"></div> clamp


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

## <div id="pow"></div> pow


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

## <div id="rangeMap"></div> rangeMap


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

## <div id="assign"></div> assign


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

## <div id="has"></div> has


```ts
has: (path?: string) => (obj: any) => boolean
```


Checks whether `obj` has a value at the given `path` . Not to be confused with `object.hasOwnProperty` 

<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const has = (path = "") => obj => exists(get(path)(obj))
```

  <p>
</details>

## <div id="objectFromEntry"></div> objectFromEntry


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

## <div id="mapEntry"></div> mapEntry


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

## <div id="mapObject"></div> mapObject


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
