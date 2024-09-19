---
title: 《JavaScript函数式编程指南》第六章 坚不可摧的代码
date: 2023-12-28 12:00:00
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---

# 第六章 坚不可摧的代码

## 本章内容

> 函数式编程会如何改变测试⽅式
> 认识到测试命令式代码的挑战
> 使⽤ QUnit 测试函数式代码
> JSCheck 探索属性测试
> 使⽤ Blanket 测量程序的复杂性

## 函数式编程对单元测试的影响

> 通常有 3 种测试类型：单元测试、集成测试和验收测试。在测试⾦字塔（⻅图 1）中，从验收测试（顶部）到单元测试（底部），函数式编程的影响越来越⼤。这是⾮常显⽽易⻅的，因为函数式编程是⼀种专注于函数和模块，及其组合的软件开发模式

![图1](../img/book6/fn1.png)

> 函数式编程的真正重点当然是函数、模块单元以及它们之间的交互。本书选取的测试库是流⾏的 QUnit。单元测试的基本结构如下：

```javascript
QUnit.test("Test Find Person", function (assert) {
  const ssn = "444-44-4444";
  const p = findPerson(ssn);
  assert.equal(p.ssn, ssn);
});
```

## 测试命令式代码的困难

> 测试命令式代码和写命令式代码⼀样难受。测试命令式代码是真正的挑战，因为它基于全局状态与变化，⽽不是控制数据流，再在其中加⼊计算。设计单元测试的其中⼀个主要原则是隔离。单元测试应该不需要察觉到周围其他测试或数据，但代码中的副作⽤使得这⼀原则很难履⾏。

命令式代码的特点如下:

- 很难识别或拆分成简单任务
- 依赖于共享资源，使得测试结果不⼀致
- 强⾏预定义求值的顺序

### 难以识别和分解任务

> 本书前⾯提到的 showStudent 的命令式版本，图 2 尝试将它分割成⼀些部分。
> ![图2](../img/book6/fn2.png)
> 可以看到，该程序由紧密耦合的业务逻辑组成，业务在各个⽅⾯都与程序相互联系。完全没有理由让数据验证、获取学⽣记录以及修改 DOM 耦合在⼀起。这些完全可以拆成单独的业务单元再组合进来。此外，通过第 5 章的介绍，错误处理逻辑应该⽤ Monad 来分离处理

### 对共享资源的依赖会导致结果不⼀致

> 下⾯⽤⼀个简单点的例⼦进⾏说明。回想⼀下命令式的 increment 函数：

```javascript
var counter = 0; // (global)
function increment() {
  return ++counter;
}
```

可以写⼀个简单的单元测试，使其返回 1。但是如果运⾏ 100 次，返回的还是 1 吗？因为该函数修改依赖来⾃外部的数据（⻅图 3）:
![图3](../img/book6/fn3.png)

因为第⼀次修改了外部计数器变量，依赖于同样变量的第⼆次测试⾃然不会再返回 1，所以第⼆次测试失败了。同理，有副作⽤的函数也容易因顺序变化⽽发⽣错误。

### 按预定义顺序执⾏

> 单元测试应该是符合交换律的，意思是说，即使改变测试运⾏的顺序，也不应该对结果有任何影响。跟前⾯的原因⼀样，不纯的函数也不符合这⼀原则。要解决此问题，单元测试库，例如 QUnit 含有⼀些在建⽴和关闭时可以配置全局测试环境的外部机制。但⼀个测试的设置可能会跟另⼀个完全不同的，所以不得不在每个测试开始时设⽴先决条件。这也意味着，对于每个测试，测试⼈员需要负责识别被测代码中的所有副作⽤（外部依赖）。

为了说明这⼀点，先创建⼀个 increment 的简单测试来验证其对负数、零和正数的⾏为（⻅图 4）。在第⼀次运⾏时（左侧图），所有测试都通过了。当随机打乱测试（右侧图）的顺序后，第⼆测试失败。这是因为测试运⾏在建⽴好的周边状态的假设上
![图4](../img/book6/fn4.png)

就算把每⼀个测试的状态都设置正确，让测试通过，但也不能保证它们的位置。只需要简单换⼀下位置，就⾜以让所有断⾔失效。
运⽤函数式的思维有助于构建可靠的测试。如果代码是函数式⻛格，这些好处将不请⾃来。预期往测试代码中硬塞函数式原则，还不如⼀开始就投⼊时间写函数式的代码。下⾯来看测试函数式代码的好处

## 测试函数式代码

测试函数式代码的好处如下

- 把函数当作⿊盒⼦
- 专注于业务逻辑，⽽不是控制流
- 使⽤ Monadic 隔离纯和不纯的代码

### 把函数当作⿊盒⼦

> 函数式编程⿎励以松耦合的⽅式对⼀组输⼊做处理，使其与应⽤程序的其余部分相独⽴。这些函数⽆副作⽤，引⽤透明，因此不管调⽤多少次，也不管以什么样的顺序测试，都可以很容易地预测测试结果。这样就可以把函数作为⿊盒⼦，只专注于由给定的输⼊断⾔相应的输出。测试 showStudent 函数的代价与测试 increment 函数是⼀个级别的，如图 5 所⽰。
> ![图5](../img/book6/fn5.png)

### 专注于业务逻辑，⽽不是控制流

```javascript
const fork = function (join, func1, func2) {
  return function (val) {
    return join(func1(val), func2(val));
  };
};
const toLetterGrade = function (grade) {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
};
const computeAverageGrade = R.compose(
  toLetterGrade,
  fork(R.divide, R.sum, R.length)
);
QUnit.test("Compute Average Grade", function (assert) {
  assert.equal(computeAverageGrade([80, 90, 100]), "A");
});
```

该程序⽤了许多简单的函数，如 Ramda 的 R.divide 、R.sum 和 R.length， 还⽤了⾃定义函数组合⼦ fork ，再将其结果与
toLetterGrade 组合。Ramda 提供的函数已经测试过了，因此没有必要⾃⼰再测⼀遍。这也是使⽤函数式库带来的好处，所以剩下需要做的只是写 toLetterGrade 的单元测试：

```javascript
QUnit.test("Compute Average Grade: toLetterGrade", function (assert) {
  assert.equal(toLetterGrade(90), "A");
  assert.equal(toLetterGrade(200), "A");
  assert.equal(toLetterGrade(80), "B");
  assert.equal(toLetterGrade(89), "B");
  assert.equal(toLetterGrade(70), "C");
  assert.equal(toLetterGrade(60), "D");
  assert.equal(toLetterGrade(59), "F");
  assert.equal(toLetterGrade(-10), "F");
});
```

### 使⽤ Monadic 式从不纯的代码中分离出纯函数

> Monad 是一个自函子范畴上的幺半群，Monad 本身是一个非常简 单的东西, 像是 Rust 中的 Option 一样, 一旦理解, 就发现再也回不去之前没有他的世界了. Monad 并不仅局限于函数式编程语言, 也可以用其他的语言来表示.

函数式编程的⽬的是让业务减少导致副作⽤的函数（如 IO），这样就可以增加应⽤程序逻辑的可测范围，同时解耦不需要负
责的 IO 边界测试。再来看 showStudent 的函数式版本：

```javascript
const showStudent = R.compose(
  map(append("#student-info")),
  liftIO,
  getOrElse("unable to find student"),
  map(csv),
  map(R.props(["ssn", "firstname", "lastname"])),
  chain(findStudent),
  chain(checkLengthSsn),
  lift(cleanInput)
);
```

仔细对照函数式版本和⾮函数式版本的代码，就会发现函数式版本是如何使⽤组合和 Monad 来拆分命令式版本的。这样做⽴刻扩⼤了 showStudent 的可测试范围，并且清楚地识别与分离了纯和不纯的函数（见图 6）

> ![图6](../img/book6/fn6.png)

## 通过代码覆盖率衡量有效性

### 衡量有效输⼊的函数式代码的有效性

⾸先看⼀下命令式 showStudent 的代码覆盖统计数据。⽤ Blanket 和 QUnit 对这段代码进⾏测试.
运⾏下⾯的测试

命令式代码

```javascript
function showStudent(ssn) {
  if (ssn != null) {
    ssn = ssn.replace(/^\s*|\-|\s*$/g, "");
    if (ssn.length !== 9) {
      throw new Error("Invalid Input");
    }
    let student = db.get(ssn);
    if (student) {
      document.querySelector(`#${elementId}`).innerHTML = `${student.ssn},
 ${student.firstname},
 ${student.lastname}`;
    } else {
      throw new Error("Student not found!");
    }
  } else {
    throw new Error("Invalid SSN!");
  }
}

// test
QUnit.test("Imperative showStudent with valid user", function (assert) {
  const result = showStudent("444-44-4444");
  assert.equal(result, "444-44-4444, Alonzo, Church");
});
```
图 7 所⽰的 QUnit /Blanket 声明式代码输出表明，语句的覆盖百分⽐为 80%。
> ![图7](../img/book6/fn7.png)


函数式代码
```javascript
var trim = function (str) {
  return str.replace(/^\s*|\s*$/g, "");
};
var normalize = function (str) {
  return str.replace(/\-/g, "");
};
var cleanInput = R.compose(R.tap(trace), normalize, R.tap(trace), trim);
var csv = function (columns) {
  return columns.join(", ");
};
var safeFetchRecord = R.curry(function (store, studentId) {
  return Either.fromNullable(store.get(studentId)).getOrElseThrow(
    "Student not found with ID:" + studentId
  );
});
var validLength = function (len, str) {
  return str.length === len;
};
var checkLengthSsn = function (str) {
  return Either.of(str)
    .filter(validLength.bind(undefined, 9))
    .getOrElseThrow("Input:" + str + "is not a valid SSN number");
};
var fundStudent = safeFetchRecord(DB("students"));
const showStudent = R.compose(
  map(append("#student-info")),
  liftIO,
  getOrElse("unable to find student"),
  map(csv),
  map(R.props(["ssn", "firstname", "lastname"])),
  chain(findStudent),
  chain(checkLengthSsn),
  lift(cleanInput)
);

// test
QUnit.test("Imperative showStudent with valid user", function (assert) {
  const result = showStudent("444-44-4444").run();
});
```
图 8 所⽰的 QUnit /Blanket 声明式代码输出表明，测试函数式代码覆盖率⾼达100%
> ![图8](../img/book6/fn8.png)

但是如果只⽤合法数据来测试，为什么错误处理的逻辑也能覆盖到呢？这就是Monad的神奇之处，它可以⽆缝地在整个程序中传递空值（使⽤Either.Left 或者Maybe.Nothing ），因此每个函数得以运⾏，但映射函数中的逻辑被跳过。函数式代码的灵活性都⾮常显著

### 衡量⽆效输⼊的命令式代码和函数式代码的有效性

```
QUnit.test('Imperative Show Student with null', function (assert) {
 const result = showStudent(null);
 assert.equal(result, null);
});
```
所有被跳过的逻辑区域如图9.1所⽰
> ![图9.1](../img/book6/fn9-1.png)
showStudent 的代码跳过了所有合法输⼊的路径，得到了⾮常低的40%的覆盖率。

出现这种结果是因为控制流的if-else 块的存在，它导致了不同的分⽀，也导致了函数的复杂。
相⽐之下，函数式的null 处理更为优雅些，因为它避免了直接处理⾮法输⼊（⽐如null ）的逻辑。整个程序的结构（函数之间的交互）都⽆须做出任何调整，就可以成功地进⾏调⽤和测试。⼀旦有错误，函数式代码的输出会是Nothing 。开发者完全不必要检查null输出，只需要下⾯这个测试就⾜够了：

```
QUnit.test('Functional Show Student with null', function (assert) {
 const result = showStudent(null).run();
 assert.ok(result.isNothing);
});
```
所有被跳过的逻辑区域如图9.2所⽰
> ![图9.2](../img/book6/fn9-2.png)
函数式版本的showStudent 跳过操作数据的区域，这些区域对于合法输⼊会执⾏
但即使对于⽆效数据，函数式程序也不仅仅是跳过整段代码的执⾏。它优雅地、安全地在Monad中传递⽆效状态，覆盖率仍然能达到80%（两倍命令式代码）


# 总结
- 依赖于简单函数抽象的程序是模块化的。
- 基于纯函数的模块化的代码很容易测试
- 型测试⽅法，如基于属性的测试。
- 可测试的代码⼀定是简单的控制流。
- 简单的控制流可以降低整个程序的复杂度
- 降低复杂度的代码更容易推理。