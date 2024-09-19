---
title: 《JavaScript函数式编程指南》第五章 针对复杂应用的设计模式
date: 2023-12-12 12:00:00
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---

# 第五章 针对复杂应用的设计模式

## 本章内容
> 设么是函子(Functor)
> 函子的用途
> 常用的函子
## 什么是函子(Functor)
>在百科里面的定义：在范畴论中，函子是两个范畴之间的一种映射。函子可以看作是范畴论中的态射（morphism）的推广。函子可以将一个范畴A中的对象映射到另一个范畴B中的对象，同时也将A中的态射映射到B中的态射。函子还必须满足一些特定的性质，即保持范畴论中的同一性和复合性。函子在数学分析、代数拓扑、微分几何、表示论、数理逻辑、类型理论、编程语言等领域中都有应用。

>在函数式编程里面：函子是一种受规则约束的数据类型，其中包含值(value)和值的变形关系(函数)。函子可以看作是一个容器，它包含了值，通过变形关系，我们可以在容器里面的值上加一些额外的操作，从而变形成另外一个容器。函子的价值在于，我们可以通过同样的变形关系，对不同的容器进行变形。这里的变形关系就是函数，函子就是函数式编程里面的函数。

>具体的理解：函子是一种特殊的容器，通过一个普通的对象来实现，该对象具有map方法，map方法可以运行一个函数对值进行处理(变形关系)并返回一个包含新值的函子，该函子包含了处理后的值。

## 函子的用途
>它是一种新的函数组合方式，可以链式调用，可以用于约束传输的数据结构，可以映射适配函数的输出值与下一个函数输入值，可以一定程度上避免函数执行的副作用，当然除了这个之外我们还可以通过函子去控制异常，来进行异步操作等等。

## 常用的函子

### 函子的基础定义

```js
// 函子
class Functor {
  constructor(val) {
    this.value = val;
  }
  map(fn) {
    return new Functor(fn(this.value));
  }
}
const add = (x) => {
  return { value: x + 1 };
};
const double = (x) => {
  return { value: x * 2 };
};
const square = (x) => {
  return {
    value: Math.pow(x, 2),
  };
};

const functor = new Functor(2);
const result = functor
  .map((d) => add(d))
  .map((d) => double(d.value))
  .map((d) => square(d.value));
console.log(result.value); // {value: 36}
```

> 函数式编程的运算不直接操作值，而是由函子来完成。所有函子都有一个map对象。通过map方法访问里面的值，然后返回一个新的函子，这样就可以链式调用map方法了。

### Pointed 函子

> Pointed 函子是实现了 of 静态方法的函子，of 方法是为了避免使用 new 来创建对象，使用 of 方法来替代 new 来创建对象，生成一个函子，使代码更具有一致性。

```js
class Pointed extends Functor {
  static of(val) {
    return new Pointed(val);
  }
}
const res2 = Pointed.of(2)
  .map((d) => add(d))
  .map((d) => double(d.value))
  .map((d) => square(d.value));
console.log(res2.value); // {value: 36}
```

### MayBe 函子 

> MayBe 函子是用来解决空值问题的，它的 of 方法判断传入的值是否为空，如果为空则返回一个空函子，如果不为空则返回一个包含传入值的函子，用来控制因为空值而导致的异常，引起的副作用。

```js
// Maybe 函子 用来解决空值的问题
class Maybe extends Functor {
  static of(val) {
    return new Maybe(val);
  }
  isNothing() {
    return this.value === null || this.value === undefined;
  }
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }
}

const res3 = Maybe.of(2)
  .map((d) => add(d))
  .map((d) => double(d.value))
  .map((d) => square(d.value));
console.log(res3.value); // {value: 36}

const user = {
  name: "Holmes",
  address: {
    street: "Baker Street",
    number: "221B",
  },
};

const street = user && user.address && user.address.street;

const res4 = Maybe.of(user)
  .map((user) => user.address)
  .map((address) => address.street);
console.log(res4.value); // Baker Street
```

### Either 函子

> Either 函子是用来解决异常问题的，它的 of 方法判断传入的值是否为异常，如果是异常则返回一个包含异常信息的函子，如果不是异常则返回一个包含传入值的函子，用来控制因异常而导致的副作用。有两个值 left 和 right 用来表示错误和正确的值。

```js
// Either 函子 用来解决异常处理的问题 有两个值 left 和 right 用来表示错误和正确的值
// 主要用于两个用途： 代替条件运算(if...else)，提供默认值 代替异常处理(try...catch)，捕捉详细的错误信息
class Either extends Functor {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  static of(left, right) {
    return new Either(left, right);
  }
  isNothing() {
    return this.right === null || this.right === undefined;
  }
  map(fn) {
    return this.isNothing()
      ? Either.of(fn(this.left), this.right)
      : Either.of(this.left, fn(this.right));
  }
}

const res5 = Either.of(1, 5).map((x) => x * 2);
console.log(res5); // Either { value: null, left: 2, right: 10 }

// 解析 JSON 字符串
function parseJson(jsonStr) {
  let rst = null;
  let err = null;
  try {
    rst = JSON.parse(jsonStr);
  } catch (e) {
    err = e;
  }

  return Either.of(err, rst);
}

// => Either { value: null, left: 'SYNTAXERROR', right: null }
const res6 = parseJson('{name:"Lucy"}').map((val) => val.name.toUpperCase());
console.log(res6); // Either { value: null, left: 'SYNTAXERROR', right: null }
// => Either { value: null, left: null, right: 'LUCY' }
const res7 = parseJson('{"name":"Lucy"}').map((val) => val.name.toUpperCase());
console.log(res7); // Either { value: null, left: null, right: 'LUCY' }
```

### Monad 函子

> Monad 函子是用来解决函子嵌套问题的，它的 of 方法判断传入的值是否为函子，如果是函子则返回一个包含传入值的函子，如果不是函子则返回一个包含传入值的函子，用来控制因函子嵌套而导致的副作用。

```js
// Monad 函子 用来解决函子嵌套的问题
class Monad extends Functor {
  static of(val) {
    return new Monad(val);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    if (this.isNothing()) return Monad.of(null);
    let rst = fn(this.value);
    return Monad.of(rst);
  }

  join() {
    return this.value;
  }

  flatMap(fn) {
    return this.map(fn).join();
  }
}
const res9 = Monad.of(3).flatMap((n) => Monad.of(n + 2));
const res10 = Maybe.of(3).map((n) => Maybe.of(n + 2));
console.log(res9); // Monad { value: 5 }
console.log(res10); // Maybe { value: { value: 5 } }
```

### IO 函子

> IO 函子是用来控制副作用的，它的 of 方法判断传入的值是否为函数，如果是函数则返回一个包含传入值的函子，如果不是函数则返回一个包含传入值的函子，用来控制因副作用而导致的副作用。

```js
// IO 函子 用来解决副作用的问题
class IO {
  static of(val) {
    return new IO(() => val);
  }

  constructor(val) {
    this.value = val;
  }

  map(fn) {
    if (this.isNothing()) return IO.of(null);
    return new IO(() => fn(this.value()));
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  join() {
    return this.value();
  }

  flatMap(fn) {
    return new IO(() => fn(this.value()).join());
  }
}

const readFile = (name) =>
  new IO(() => {
    console.log("readFile");
    return `请求并返回${name}文件内容`;
  });
const format = (info) =>
  new IO(() => {
    console.log("format");
    return `格式化内容("${info}")`;
  });

const print = (info) =>
  new IO(() => {
    console.log("print");
    return `打印格式化后的内容：${info}`;
  });

// 并没有执行
const readAndPrint = readFile("book.pdf").flatMap(format).flatMap(print);

readAndPrint.join();
```

### Task 函子

> Task 函子是用来控制异步的，它的 of 方法判断传入的值是否为函数，如果是函数则返回一个包含传入值的函子，如果不是函数则返回一个包含传入值的函子，用来控制因异步而导致的副作用。

```js
// Task 函子 用来解决异步的问题
class Task {
  static of(val) {
    return new Task((resolve) => resolve(val));
  }

  constructor(fn) {
    this.value = fn;
  }

  map(fn) {
    return new Task((resolve) => {
      this.value((val) => resolve(fn(val)));
    });
  }

  join() {
    return new Task((resolve) => {
      this.value((task) => task.value(resolve));
    });
  }

  flatMap(fn) {
    return this.map(fn).join();
  }
}

const readFile = (name) =>
  new Task((resolve) => {
    console.log("readFile");
    setTimeout(() => {
      resolve(`请求并返回${name}文件内容`);
    }, 1000);
  });

const format = (info) =>
  new Task((resolve) => {
    console.log("format");
    setTimeout(() => {
      resolve(`格式化内容("${info}")`);
    }, 1000);
  });

const print = (info) =>
  new Task((resolve) => {
    console.log("print");
    setTimeout(() => {
      resolve(`打印格式化后的内容：${info}`);
    }, 1000);
  });
  
// 并没有执行
const readAndPrint = readFile("book.pdf").flatMap(format).flatMap(print);

// 执行
readAndPrint.value((val) => console.log(val)); // 打印格式化后的内容：格式化内容("请求并返回book.pdf文件内容")
```

## 总结

> 函子是一种特殊的容器，通过一个普通的对象来实现，该对象具有map方法，map方法可以运行一个函数对值进行处理(变形关系)并返回一个包含新值的函子，该函子包含了处理后的值。它是一种新的函数组合方式，可以链式调用，可以用于约束传输的数据结构，可以映射适配函数的输出值与下一个函数输入值，可以一定程度上避免函数执行的副作用，当然除了这个之外我们还可以通过函子去控制异常，来进行异步操作等等。