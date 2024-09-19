---
title: 《JavaScript函数式编程指南》第七章 函数式优化
date: 2024-01-03 12:00:00
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---

# 第七章 函数式优化

## 本章内容

> 如何识别高性能的函数式代码
> JavaScript 函数执行的内部机制
> 嵌套函数的背景和递归
> 通过惰性求值优化函数调用
> 使用记忆化（memoization）加速程序执行
> 使用尾递归函数展开递归调用

97%的时候我们应该忽略效率......过早的优化是一切罪恶的根源。然
而,我们决不能错过这关键的 3%的优化机会。

不理解其运行环境就使用新的范式是不明智的
函数式编程不会加快单个函数的求值速度

## 7.1 函数执行机制

### 函数调用栈

#### 什么是栈？

栈是一个基本的数据结构，它的插入和取出顺序是后进先出（LIFO）。可以想象成一个个堆叠在一起的碟子：所有操作都只能从最顶部的碟子开始。
![栈](../img/book7/栈.gif)

#### 函数的执行与栈的关系？

JavaScript 编程模型中的上下文堆栈负责管理函数执行以及关闭变量作用域。堆栈始终从全局执行上下文帧开始，其包含所有全局变量，

全局上下文帧永远驻留在堆栈的底部。每个函数的上下文帧都占用一定量的内存，实际取决于其中的局部变量的个数。如果没有任何局部变量，一个空帧大约 48 个字节。每个数字或布尔类型的局部变量和参数会占用 8 字节。所以，函数体声明越多的变量，就需要越大的堆栈帧

**注意：函数的作用域链与 JavaScript 对象的原型链不是一回事。虽然两者表现得很类似，但是原型链通过 prototype 属性建立对象继承的链接，而作用域链是指内部函数能访问到外部函数的闭包。**

#### 为什么是栈结构。

- JavaScript 是单线程的，这意味着执行的同步性。
- 有且只有一个全局上下文（与所有函数的上下文共享）。
- 函数上下文的数量是有限制的（对客户端代码，不同的浏览器可以有不同的限制）。
- 每个函数调用会创建一个新的执行上下文，递归调用也是如此

### 柯里化的上下文堆栈

```js
const _placeholder = { "@@functional/placeholder": true };
function _isPlaceholder(a) {
  return a === _placeholder;
}
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a)
          ? f2
          : _curry1(function (_b) {
              return fn(a, _b);
            });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b)
          ? f2
          : _isPlaceholder(a)
          ? _curry1(function (_a) {
              return fn(_a, b);
            })
          : _isPlaceholder(b)
          ? _curry1(function (_b) {
              return fn(a, _b);
            })
          : fn(a, b);
    }
  };
}

const add = function (a, b) {
  return a + b;
};
function addAll(arr, fn) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      result += fn(arr[i], arr[j]);
    }
  }
  return result;
}
const c_add = _curry2(add);
//柯里化执行
addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], c_add);
//非柯里化执行
addAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], add);
```

### 递归的弱点

#### 递归导致的栈溢出

函数调用自己时也会创建新的函数上下文。

永远无法满足结束条件，很容易导致堆栈溢出
如果你⻅过错误`Range Error: Maximum Call Stack Exceeded or toomuch recursion`，就会知道递归有问题了。

可执行 demo

```js
function increment(i) {
  console.log(i);
  increment(++i);
}
increment(1);
```

chrome 最大执行次数： 10438
![chrome递归最大限度](../img/book7/chrome递归最大限度.gif)

小房子 最大执行次数： 25160，但是 5000 以上就很慢了
![小房子的递归最大限度](../img/book7/小房子的递归最大限度.gif)

这些数字只是为了说明递归是有限制的。代码预设应该要远远低于这些阈值，否则递归肯定是有问题的。

**vue 的优化** RECURSION_LIMIT:100 次
依赖的响应性状态不断地触发改变,从而递归地触发自身渲染。例如：
组件模板、渲染函数、更新的钩子或 watch 源函数

#### 案例：斐波那契

递归实现

```js
function fib(n) {
  if (n === 1 || n === 2) return n - 1;
  return fib(n - 1) + fib(n - 2);
}
fib(6);
```

![斐波拉契递归调用栈](../img/book7/斐波拉契递归调用栈.gif)

非递归实现

```js
function fib(n) {
  let a = 0;
  let b = 1;
  let c = a + b;
  for (let i = 3; i < n; i++) {
    a = b;
    b = c;
    c = a + b;
  }
  return c;
}
fib(6);
```

![斐波那契](../img/book7/斐波那契非递归栈.gif)

虽然柯里化和递归导致更多的内存占用，但是鉴于它们带来的灵活性和复用性以及递归解决方案固有的正确性，又感觉这些额外的内存花费是值得的。

函数式编程还提供了其他范式没有的优化。大量函数推入堆栈会增加程序的内存占用，那么为什么不避免不必要的调用？

## 7.2 使用惰性求值推迟执行

### 概念

> 惰性求值：只会在需要结果的时候才执行
> 贪婪求值：表达式绑定到变量时求值，不管结果是否会被用到

当输入很大但只有一个小的子集有效时，避免不必要的函数调用可以体现出许多性能优势

- 避免不必要的计算。
- 使用函数式类库

### 使用函数式组合子避免重复计算

在最简单的情况下，可以通过只传递函数引用（或名称），然后有条件地选择调用或不调用

```js
const alt = R.curry((func1, func2, val) => func1(val) || func2(val));
const showStudent = R.compose(append("#student-info"), alt(findStudent, createNewStudent));
//没有函数会过早地调用，因为组合子使用的只是它们的函数引用
showStudent("444-44-4444");
```

以上案例是避免不必要计算的简单方法之一

如果在运行前就定义好程序，就可以使用函数式库的 shortcut fusion 技术来优化

### 利用 shortcut fusion(快捷方式融合)

> shortcut fusion 是一种合并迭代调用的优化策略;这有助于避免创建中间数据结构，并大大减少迭代执行的次数

```js
function pricelt(x) {
  return function (item) {
    return item.price < x;
  };
}

var gems = [
  { name: "Sunstone", price: 4 },
  { name: "Amethyst", price: 15 },
  { name: "Prehnite", price: 20 },
  { name: "Sugilite", prrice: 7 },
  { name: "Diopside", price: 3 },

  { name: "Feldspar", price: 13 },
  { name: "Dioptase", price: 2 },
  { name: "Sapphire", price: 20 },
];

var chosen = _(gems).filter(pricelt(10)).take(3).value();
```

![常规执行](../img/book7/s1.gif)
![shortcut fusion](../img/book7/s2.gif)

- `_(gems)`拿到数据集，缓存起来
- 遇到 `filter` 方法，先记下来
- 遇到 `take` 方法，先记下来
- 遇到 `value` 方法，说明时机到了
- 把小本本拿出来，看下要求：要取出 3 个数，`price<10`
- 使用 `filter` 方法里的判断方法 priceLt 对数据进行逐个裁决

#### lodash 的 shortcut fusion

```js
var MAX_ARRAY_LENGTH = 4294967295; // 最大的数组长度

// 缓存数据结构体
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
}

// 惰性求值的入口
function lazy(value) {
  return new LazyWrapper(value);
}
```

实现 filter

```js
ar LAZY_FILTER_FLAG = 1; // filter方法的标记

// 根据 筛选方法iteratee 筛选数据
function filter(iteratee){
    this.__iteratees__.push({
        'iteratee': iteratee,
        'type': LAZY_FILTER_FLAG
    });
    return this;
}

// 绑定方法到原型链上
LazyWrapper.prototype.filter = filter;
```

take 方法

```js
// 截取n个数据
function take(n) {
  this.__takeCount__ = n;
  return this;
}

LazyWrapper.prototype.take = take;
```

```js
// 惰性求值
function lazyValue() {
  var array = this.__wrapped__;
  var length = array.length;
  var resIndex = 0;
  var takeCount = this.__takeCount__;
  var iteratees = this.__iteratees__;
  var iterLength = iteratees.length;
  var index = -1;
  var dir = 1;
  var result = [];

  // 标签语句
  outer: while (length-- && resIndex < takeCount) {
    // 外层循环待处理的数组
    index += dir;

    var iterIndex = -1;
    var value = array[index];

    while (++iterIndex < iterLength) {
      // 内层循环处理链上的方法
      var data = iteratees[iterIndex];
      var iteratee = data.iteratee;
      var type = data.type;
      var computed = iteratee(value);

      // 处理数据不符合要求的情况
      if (!computed) {
        if (type == LAZY_FILTER_FLAG) {
          continue outer;
        } else {
          break outer;
        }
      }
    }

    // 经过内层循环，符合要求的数据
    result[resIndex++] = value;
  }

  return result;
}

LazyWrapper.prototype.value = lazyValue;
```

Lodash 还有一些其他带有 shortcut fusion 优化的函数，如`_.drop`、`_.dropRight`、`_.dropRightWhile`、`_.dropWhile`、`_.first`、`_.initial`、`_.last`、`_.pluck`、`_.reject`、`_.rest`、`_.reverse`、`_.slice`、`_.takeRight`、`_.takeRightWhile`、`_.takeWhile`和`_.where`。

除此之外，函数式还有另一种避免重复计算的技术：记忆化（memorization）。

## 7.3 实现需要时调用的策略

加快应用程序执行的方法之一是避免计算重复值，特别是当这些计算的代价昂贵时。在传统的面向对象系统中，这可以通过在函数调用前检查高速缓存或代理层来实现。在返回时，给函数的结果赋予唯一的键值并持久化到缓存中。缓存作为耗时操作之前查询的中介或记忆体。

记忆化的方案与缓存类似。它就像以前的代码中，基于函数的参数创建与之对应的唯一的键，并将结果值存储到对应的键上，当再次遇到相同参数的函数时，立即返回存储的结果。

```js
Function.prototype.memoized = function () {
  //内部的工具方法负责为当前函数实例创建缓存逻辑
  let key = JSON.stringify(arguments); //将参数字符串化以获得对当前函数调用的键值。可以通过检测输入类型来创建更加鲁棒的键值生成方法。这只是一个简单的例子
  this._cache = this._cache || {}; //为当前函数实例创建一个内部的缓存
  this._cache[key] = this._cache[key] || this.apply(this, arguments); //先试图读取缓存，通过输入来判断是否计算过。如果找到对应的值，则跳过函数调用直接返回；否则，执行计算
  return this._cache[key];
};
Function.prototype.memoize = function () {
  //激活函数的记忆化
  let fn = this;
  if (fn.length === 0 || fn.length > 1) {
    return fn; //只尝试记忆化一元函数
  }
  return function () {
    return fn.memoized.apply(fn, arguments); //将函数实体包裹在记忆化函数中
  };
};
```

### 案例阶乘

`n! = n* (n– 1) * (n– 2) * ... * 3 * 2 * 1`

**注意：阶乘数是可以通过更小的阶乘数递归定义的，比如 `4!=4*3!`**

无记忆的阶乘

```js
function jc(n) {
  return n === 0 ? 1 : n * jc(n - 1);
}
jc(2);
jc(3);
```

![阶乘-无记忆](../img/book7/阶乘-无记忆.gif)

有记忆的阶乘

```js
Function.prototype.memoized = function () {
  let key = JSON.stringify(arguments);
  this._cache = this._cache || {};
  this._cache[key] = this._cache[key] || this.apply(this, arguments);
  return this._cache[key];
};
Function.prototype.memoize = function () {
  let fn = this;
  if (fn.length === 0 || fn.length > 1) {
    return fn;
  }
  return function () {
    return fn.memoized.apply(fn, arguments);
  };
};
const factorial = function jc(n) {
  return n === 0 ? 1 : n * factorial(n - 1);
}.memoize();
factorial(2);
factorial(3);
```

![阶乘-有记忆](../img/book7/阶乘-有记忆.gif)

第二次运行的速度比第一次快

## 7.4 递归和尾递归优化

### 尾部调用优化

> 尾部调用优化（TCO）也称为尾部调用消除,是 ES6 添加的编译器增强功能。同时，在最后的位置调用别的函数也可以优化（虽然通常是本身），该调用位置称为尾部位置（尾递归因此而得名）

这为什么算是一种优化？函数的最后一件事情如果是递归的函数调用，那么运行时会认为不必要保持当前的栈帧，因为所有工作已经完成，完全可以抛弃当前帧。在大多数情况下，只有将函数的上下文状态作为参数传递给下一个函数调用（正如在递归阶乘函数处看到的），才能使递归调用不需要依赖当前帧。通过这种方式，递归每次都会创建一个新的帧，回收旧的帧，而不是将新的帧叠在旧的上。

![尾递归调用模式变化](../img/book7/尾递归调用模式变化.png)

```js
function jc(n, current = 1) {
  return n === 1 ? current : jc(n - 1, n * current); // 函数最后一条语句是下一次递归（即处于尾部）
}
jc(2);
jc(3);
```

### 将非尾递归转换成尾递归

这是尾递归吗？

```js
const factorial = (n) => (n === 1 ? 1 : n * factorial(n - 1));
```

递归调用并没有发生在尾部，因为最后返回的表达式是`n *factorial(n - 1)`。切记，**最后一个步骤一定要是递归**，这样才会在运行时 TCO 将 factorial 转换成一个循环。改成尾递归只需要两步。

- 1）将当前乘法结果当作参数传入递归函数。
- 2）使用 ES6 的默认参数给定一个默认值（也可以部分地应用它们，但默认参数会让代码更整洁）

```
    ES5 中模仿尾递归调用

    目前主流的 JavaScript 实现 ES5 并不具备尾调用优化支持。ES6 将其加
    入被称为适当尾调用的提案（在 ECMA-262 规范的 14.6 部分）。还记得第 2
    章中使用的 Babel 转译器（源代码到源代码的编译器）吗？那是用来测
    试语言新特性的绝佳方式。

    还有一种解决方式是使用 trampolining。trampolining 可以用迭代的方式模拟尾递归，
    所以可以非常理想、容易地控制JavaScript 的堆栈。

    trampoline 是一个接受函数的函数，它会多次调用函数，直到满足一
    定的条件。一个可反弹或者重复的函数被封装在 thunk 结构中。thunk 只不
    过是多了一层函数包裹。在函数式 JavaScript 背景下，可以用 thunk 及简单
    的匿名函数包裹期望惰性求值的值。

    thunk 和 trampolining 的话题已经超出了本书的范围，如果读者非常希
    望用这些技术来优化递归函数，可以从这个概念开始展开研究
```

如果需要一个图形渲染一个大型的数据，那么性能就成为一项关键要求。在这种情况下，开发者就可能需要做出取舍，即可能不需要编写优雅、可扩展的代码，而需要快速地完成工作。

## 7.5 总结

- 在某些情况下，函数式代码可能比与其等效的命令式代码更慢或消耗的内存更多。
- 可以利用交替组合子以及函数式库（如 Lodash）中提供的支持来实施延迟策略。
- memoization（内部函数级缓存策略）可用于避免重复对潜在费时函数进行求值。
- 将程序分解成简单的函数不仅可以创建可扩展代码，还可以通过记忆化来使其更高效。
- 递归可以通过分解把问题化为更简单的自相似问题，继而充分利用记忆化优化上下文堆栈的使用。
- 将函数转换为尾递归形式，就可以借助编译器优化消除尾调用。

## 推荐工具

[事件循环可视化工具：https://www.jsv9000.app/](https://www.jsv9000.app/)
[记忆函数：https://www.npmjs.com/package/memoize](https://www.npmjs.com/package/memoize)
[异步缓存：https://www.npmjs.com/package/promise-memoize](https://www.npmjs.com/package/promise-memoize)
