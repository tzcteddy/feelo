---
title: 《JavaScript函数式编程指南》第三章 轻数据结构，重操作
date: 2023-11-27 10:00:00
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---
# 第三章 轻数据结构，重操作

## 本章内容
> 理解程序的控制流
> 更易理解的代码与数据
> 命令抽象函数 map、 reduce 以及 filter
> Lodash.js 及函数链
> 递归的思考

### 为什么选择这本书

💡  前面已经了解了为什么要选择函数式以及为什么要选择JavaScript。这一部分开始，将讨论一些实用的概念，应用函数式编程来解决现实问题。

<a name="ij2QS"></a>
# 1、理解程序的控制流
> 程序为实现业务目标所要行进的路径被称为控制流。

命令式程序需要暴露所有的必要步骤才能及其详细地描述其控制流。这些步骤通常涉及大量的循环和分支，以及随语句执行变化的各种变量。
```javascript
var loop = optC();
while(loop){
  var condition = optA();
  if(condition){
    optB1();
  }else{
    optB2();
  }
  loop = optC();
}
optD();
```
下图显示了上述程序的简单流程图<br />
![简单流程图](../img/function3-fn1.png)
<br />condition 表示任意表达式，该表达式求值的结果不一定是布尔类型，如果不是布尔类型，ECMAScript 会调用Boolean() 转换函数，将这个表达式结果转换为一个布尔类型，当该值为 true 时，执行 if 代码块中的内容，否则，执行 else 代码块中的内容。<br />声明式程序，特别是函数式程序，则多使用以简单拓扑链接的独立黑盒操作组合而成的较小结构化控制流，从而提升程序的抽象层次。这些连接在一起的操作只是一些能够将状态传递至下一个操作的高阶函数，如下图。使用函数式开发风格操作数据结构，其实就是将数据与控制流视为一些高级组件的简单连接。<br />使用这种方式可以形成类似这样的代码：
```javascript
optA().optB().optC().optD();  	//这样用点连接表示有共同的对象上定义过这些方法
```
![链式操作](../img/function3-fn2.png)
<br />采用这种链式操作能够使程序简洁、流畅并富有表现力，能够从计算逻辑中很好地分离控制流，因此可以使得代码和数据更易推理。
<a name="cn2e0"></a>
# 2、链接方法
> 链接方法在函数式编程中常常用于串联一系列的操作。
> 方法链是一种能够在一个语句中调用多个方法的面向对象编程模式。当这些方法属于同一个对象时，方法链又称为方法级联。尽管该模式大多出现在面向对象的应用程序中，但在一些特定条件下，如操作不可变对象时，也能很好地用于函数式编程中。既然在函数式代码中是禁止修改对象的，又如何能使用这种方法链模式呢？ <br />

让我们来看一个字符串处理的例子：
```javascript
'Functional Programming'.substring(0, 10).toLowerCase() + 'is fun';
```
在上述示例中，`substring` 和 `toLowerCase` 都是（通过 `this`）在隶属的字符串对象上操作并返回一个新字符串的方法。JavaScript中字符串的加号（+）运算符被重载为连接字符串操作的语法糖，它也会返回一个新的字符串。通过一系列变换后的结果与原先字符串毫无引用关系，而原先的字符串也不会有任何变化。这种行为是理所当然的，因为按照设计，字符串是不可变的。从面向对象的角度来看，这没有什么特别的。但从函数式编程的角度来看，这是一种理想行为，因为不需要使用 `Lenses` 来进行字符串变换了。
<br/>
如果用更加函数式的风格重构上面的代码，它会像这样：
```javascript
concat(toLowerCase(substring('Functional Programming', 1, 10)), 'is fun')
```
上述代码符合函数式风格，所有参数都应在函数声明中明确定义，而且它没有副作用，也不会修改的原有对象。但可以说，这样的代码写起来并没有方法链流畅。而且它也更难阅读，因为需要一层层地剥离外部函数，才能知晓内部真正发生的事情。
<br/>
要遵守不可变的编程原则，函数式中也会应用这种隶属于单个对象实例的方法链。能用该模式来处理数组变换吗？其实 JavaScript 也将这种字符串的行为推广到数组上了，大多数人之所以还在用 for 循环作为权宜之计，是因为他们并不了解这些特性。
<br/>
下面是一个简单的例子，展示了如何使用链式调用风格来实现一个简单的函数式编程应用：
```javascript
// 定义一个函数，用于对数组进行过滤
function filter(array, predicate) {
    return array.filter(predicate);
}

// 定义一个函数，用于对数组进行映射
function map(array, mapper) {
    return array.map(mapper);
}

// 定义一个函数，用于对数组进行reduce
function reduce(array, reducer, initialValue) {
    return array.reduce(reducer, initialValue);
}

// 使用链式调用风格来执行一系列操作
var numbers = [1, 2, 3, 4, 5];

var filtered = filter(numbers, function (number) {
    return number > 2;
});

var mapped = map(filtered, function (number) {
    return number * 2;
});

var reduced = reduce(mapped, function (accumulator, number) {
    return accumulator + number;
}, 0);

console.log(reduced);  // 输出：24
```
在这个例子中，我们定义了三个纯函数：`filter`、`map` 和 `reduce`。然后我们使用链式调用来串联这些操作。首先，我们使用 `filter` 函数来过滤出一个只包含大于2的数字的数组。然后，我们使用 `map` 函数来将这个数组中的每个元素乘以2。最后，我们使用 `reduce` 函数来将这个数组中的所有元素加起来。
<a name="jg1cn"></a>
# 3、函数链
面向对象程序将继承作为代码重用的主要机制。回忆之前章节中，Student 类继承了父类 Person 的所有状态和方法。读者也许在一些纯面向对象的语言中更多见到的是这种模式，特别是在数据结构的实现代码中。例如在 Java 中，有一大堆继承于基础接口 List 的各种实体List 类，如ArrayList 、LinkedList 、DoublyLinkedList 、CopyOnWrite ArrayList 等，它们都源自共同的父类，并各自添加了一些特定的功能。<br/>
函数式编程则采用了不同的方式。它不是通过创建一个全新的数据结构类型来满足特定的需求，而是使用如数组这样的普通类型，并施加在一套粗粒度的高阶操作之上，这些操作是底层数据形态所不可见的。这些操作会作如下设计。<br/>
> • 接收函数作为参数，以便能够注入解决特定任务的特定行为。<br/>
> • 代替充斥着临时变量与副作用的传统循环结构，从而减少所要维护以及可能出错的代码。

函数式编程的一个常见模式是函数链，或称为“管道”模式。这种模式的核心思想是将一个数据的转换过程分解为一系列的函数，这些函数一个接一个地被调用，每个函数都产生一个新的数据并将其传递给下一个函数。

函数链通常使用高阶函数（接收函数作为参数或返回函数的函数）和链式调用实现。比如，以下是一个简单的 JavaScript 函数链示例：
```javascript
const double = x => x * 2;
const square = x => x * x;
const result = square(double(5)); // result is 100
```
在这个例子中，我们创建了三个函数：`double`、`square` 和 `result`。`double` 接收一个数字并返回其两倍，`square` 接收一个数字并返回其平方，然后我们通过链式调用（`square(double(5))`）将这两个函数串联起来。这个链式的调用顺序表示数据的转换过程：首先将 5 传递给 `double`，得到 10，然后传递给 `square`，得到 100。<br /><br />
下面让我们仔细研究一下。本章中的示例都是基于一个 Person 对象的集合。为了方便起见，我们只声明四个对象，但相同的概念同样适用于较大的集合：
```javascript
const p1 = new Person('Haskell', 'Curry', '111-11-1111');
p1.address = new Address('US');
p1.birthYear = 1900;

const p2 = new Person('Barkley', 'Rosser', '222-22-2222');
p2.address = new Address('Greece');
p2.birthYear = 1907;

const p3 = new Person('John', 'von Neumann', '333-33-3333');
p3.address = new Address('Hungary');
p3.birthYear = 1903;

const p4 = new Person('Alonzo', 'Church', '444-44-4444');
p4.address = new Address('US');
p4.birthYear = 1903;
```

## 了解lambda表达式
> lambda表达式通常被称为箭头函数。这是ES6（ECMAScript 2015）引入的一种新的函数表达式，
> 比起传统的函数声明，它提供了一种更简洁的语法形式来声明一个匿名函数。
> 尽管 lambda 函数也可以写成多行形式，但就像在第2章中见到的，单行是最普遍的形式。使用 lambda 表达式或普通函数声明语法一般只会影响到代码的可读性，其本质是一样的。

下面是Lambda表达式的基本语法：
```javascript
(parameters) => { statements }
```
下面是一个可用于提取个人姓名的示例函数：
```javascript
const name = p => p.fullname;
console.log(name(p1));    //-> 'Haskell Curry'
```
(P) => p.fullname 这种简洁的语法糖表明它只接收一个参数 p 并隐式地返回p.fullname。<br/>
下图显示了这种新语法的结构。

![箭头函数的结构。lambda函数的右侧可以是一个表达式或是一个封闭的多个语句块﻿](../img/function3-fn3.png)

这是另一个例子：
```javascript
const greet = (name) => `Hello, ${name}!`;
console.log(greet("World"));  // 输出 "Hello, World!"
```
在这个例子中，`greet` 是一个箭头函数，接收一个参数 `name`，并返回一个字符串。箭头函数可以包含多条语句，但它们不能有函数体（即花括号 `{}` 中的内容）。这意味着箭头函数只能包含一条语句。

箭头函数还有一些主要的特性：

1. **简洁的语法**：箭头函数允许你使用一个简洁的语法来创建函数。没有参数的箭头函数仅仅是一个表达式，因此可以省略掉 `return` 关键字。例如，`x => x * x` 就等同于 `(x) => { return x * x; }`。
2. **绑定 `this`**：在箭头函数中，`this` 是词法的，箭头函数的`this`在定义函数的时候绑定，而不是在执行函数的时候绑定。箭头函数没有自己的`this` 对象，箭头函数的`this` 永远指向其父级作用域，这意味着你不能在箭头函数内部改变 `this` 的值。这和普通函数不同，普通函数中的 `this` 是动态的，并且在运行时确定。
3. **无参数的 `arguments` 对象**：箭头函数不绑定自己的 `arguments` 对象。如果你在箭头函数内部使用 `arguments`，它实际上是外部作用域中的 `arguments` 对象。
4. **不绑定自己的 `new.target`**：箭头函数没有 `new.target` 属性。如果你尝试在箭头函数中使用 `new.target`，它总是返回 `undefined`。
5. **不能作为构造函数**：由于箭头函数没有自己的 `this`，因此你不能使用 new 关键字来创建一个箭头函数的实例。这是因为 `this` 在箭头函数中是词法的，并且总是指向调用该函数的对象。
6. **没有`call`、`apply`、和 `bind` 方法**：箭头函数没有自己的 `call`、`apply` 和 `bind` 方法。如果你尝试调用这些方法，它们实际上是调用外部作用域中的这些方法。
7. **没有原型链**：箭头函数没有自己的原型链。如果你尝试访问箭头函数的 `prototype` 属性，它总是返回 `undefined`。此外，箭头函数不能被用作其他函数的原型。
8. **可以嵌套**：箭头函数可以嵌套在其他箭头函数中，这是 JavaScript 中一种常见的模式。这使得代码更加简洁和可读。
9. **没有 `arguments` 对象和 `callee` 属性**：由于箭头函数没有自己的 `arguments` 对象和 `callee` 属性，因此你无法在箭头函数内部访问这些属性。
> 词法作用域就是在你写代码的时候就已经知道了变量的作用域，在处理代码时会保持作用域不变。箭头函数的this在定义函数的时候绑定,而不是在执行函数的时候绑定 箭头函数没有自己的this对象 箭头函数的this永远指向其父级作用域 任何方法都改变不了this

lambda表达式适用于函数式的函数定义，因为它总是需要返回一个值。对于单行表达式，其返回值就是函数体的值。另一个值得注意的是一等函数与lambda表达式之间的关系。函数名代表的不是一个具体的值，而是一种（惰性计算的）可获取其值的描述。换句话说，函数名指向的是代表着如何计算该数据的箭头函数。这就是在函数式编程中可以将函数作为数值使用的原因。我们将在本章进一步讨论它，并在第7章讨论惰性计算函数。<br/>
此外，函数式编程中鼓励使用的`map` 、`reduce` 以及 `filter` 等核心高阶函数都能够与 lambda 表达式良好地配合使用。很多函数式的 JavaScript 代码都需要处理数据列表，这也就是衍生 JavaScript 的函数式语言鼻祖起名为 LISP（列表处理）的原因。JavaScript 5.1 本身就提供特定版本的该类操作——称为函数式array extras 。但为了能够联合其他相似操作以提供完整的解决方案，本书会选择使用 Lodash.js 函数式库中提供的此类操作。它的工具包包含丰富的能够处理常见编程任务的基础函数（安装方法见下面），因此非常利于编写函数式程序。安装之后，就可以通过全局的 _ （下画线符号）对象来访问其功能。

**映射（Map）、过滤（Filter）和规约（Reduce）**：这是函数式编程中最常用的三个操作。映射是将一个函数应用于一个列表中的每个元素；过滤是根据某种条件筛选出列表中的元素；规约是将一个函数应用于一个列表中的所有元素，然后将结果合并成一个单一的值。你可以使用数组的`map`、`filter`和`reduce`方法来进行这些操作。<br />这些函数都是接受一个函数作为参数，并在此基础上对数组或其他可迭代对象进行操作。<br />以下是这些函数的基本用法：

1. `map(callback: Function, thisArg: Any)`: 对数组中的每个元素都调用一次 `callback` 函数，并返回一个包含回调函数返回值的新数组。
2. `reduce(callback: Function, initialValue: Any): Any`: 对数组中的每个元素执行一次 `callback` 函数，并返回一个单一的输出值。
3. `filter(callback: Function, thisArg: Any): Array`: 创建一个新的数组，包含通过 `callback` 测试的所有元素。

这些函数可以极大的简化代码，提高代码的可读性和可维护性。同时，由于它们都是高阶函数，可以方便的创建出复杂的数据处理流程。<br />
例如，你可以用这些函数来对数组进行一系列的操作，如过滤出满足某些条件的元素，对每个元素进行一些计算，然后将结果合并成一个新的数组。这在传统的命令式编程中可能需要大量的循环和条件语句才能实现，而在函数式编程中只需要几行代码就能完成。<br />
此外，由于这些函数都是纯函数，数据结构不会被改变，只返回新的值，我们可以更容易地理解和预测程序的行为。这使得代码更容易阅读和维护。

# 4、Lodash
本书中使用Lodash.js 函数式库中提供的操作，来提供完整的解决方案
> Lodash <br/>
> A modern JavaScript utility library delivering modularity, performance & extras.

Lodash 是一个现代化的，实用的 JavaScript 工具库，提供了模块化、高性能，以及一些附加功能。提供了许多用于处理数组、对象、数字、字符串、函数等的有用功能。它旨在提高开发者的效率，简化代码，并提供一致性的方法。<br />
Lodash 库提供了一些常用的工具函数，如链式调用、数组操作、对象操作、工具方法等。它还支持模块化加载，可以根据实际需要只加载需要的功能，而不必加载整个库。之前很多人把Lodash作为一个功能库来使用。当ES5、ES6给原生js增加了很多方便的方法以后，有很多人开始讨论，是否还有使用Lodash的必要。其实，Lodash中，除了提供了一些常用的便捷方法以外，还提供了与函数式编程相关的一些方法，比如说函数的柯里化、函数组合等。<br />
> Lodash 中的下画线<br/>
> Lodash 之所以使用下画线约定，是因为它是从著名且广泛使用的 `Undesrscore.js` 项目中衍生而来（[http://underscorejs.org](http://underscorejs.org))）。为了能够直接替换`Underscore`，Lodash 仍然保持与其一致的 API。但从本质上讲，为了能够以更为优雅的方式构建函数链，本书将完全重写lodash，这也伴随着一些性能的提升（我们将在第7章深入了解）。

## lodash 的安装
安装 lodash 的安装方法如下：

1. 使用 npm 安装 lodash：
```bash
npm install lodash
```

2. 使用 yarn 安装 lodash：
```bash
yarn add lodash
```

3. 在浏览器中直接使用lodash
下载lodash.js或者lodash.min.js文件，然后在html中通过src引入即可:
```html
<script src="lodash.js"></script>
```

## 用`_.map`做数据变换

> `_.map` 是 Lodash 库中的一个函数，用于遍历数组并创建一个新数组，新数组中的元素是原数组元素调用回调函数后的结果。

**以下是 `_.map` 的基本使用方法：**
```javascript
_.map(array, [iteratee = _.identity])
```
**参数：**
- **`array` (Array): 需要遍历的数组。**
- **`iteratee` (Function, optional): 回调函数。**

**返回值：**
- **(Array): 返回一个新数组。**

**示例：**<br />
假设我们有一个数组 `[1, 2, 3, 4]`，我们想要将每个元素乘以2，我们可以这样做：
```javascript
var numbers = [1, 2, 3, 4];
var doubled = _.map(numbers, function(num) {
  return num * 2;
});
console.log(doubled); // => [2, 4, 6, 8]
```
上述例子中，**`_.map`** 遍历 **`numbers`** 数组，并将每个元素乘以2。然后它返回一个新的数组 **`doubled`**，该数组包含原始数组元素经过回调函数处理后的结果。<br />

假设需要对一个较大数据集合中的所有元素进行变换，例如，从一个学生对象的列表中提取每个人的全名。你曾经有多少次不得不写出这样的语句？
```javascript
var result = [];
var persons = [p1, p2, p3, p4];
for(let i = 0; i < persons.length; i++){
  var p = persons[i];
  if( p !== null && p !== undefined){
    result.push(p.fullname);    //命令式的方案会假设fullname是Student的方法
  }
}
```
高阶函数 `map`（也称为collect ）能够将一个迭代函数有序地应用于一个数组中的每个元素，并返回一个长度相等的新数组。以下是使用 `_.map` 的函数式风格版本：
```javascript
_.map(persons,
      s => (s !== null && s !== undefined) ? s.fullname : ''    //通过高阶函数去掉了所有var声明
);
```
该操作的标准定义如下：
```javascript
map(f, [e0, e1, e2...]) -> [r0, r1, r2...];  //其中,f(en) = rn
```
如果整个集合元素需要进行变换，map 函数是极其有用的——再也不必编写循环，并处理奇怪的作用域问题了。此外，由于其是不可变的，因此输出是一个全新的数组。map 需要以一个函数f 以及拥有 n 个元素的集合作为输入，由左到右对每个元素应用函数f 后，返回一个长度为 n 的新数组。该行为如下图所示。
![操作 map 对数组的每个元素应用迭代函数 f ，并返回一个等长的数组](../img/function3-fn4.jpg)

在 `_.map` 的例子中，我们遍历了学生的对象数组并提取出他们的名字。可以用 lambda 表达式作为迭代函数（这是通常的做法）。原有的数组不会被改变，而新返回的数组包含以下元素：

```javascript
['Haskell Curry', 'Barkley Rosser', 'John von Neumann', 'Alonzo Church']
```
理解抽象层次背后的事情永远是有好处的，下面来看 `map` 是如何实现的。<br/>
**`Map`的实现**
```javascript
function map(arr, fn){    //接收一个函数和一个数组，应用函数到数组中的每一个元素，然后返回同样大小的新数组
  let idx = 0,
      len = arr.length,
      result = new Array(len);		//结果：一个与输入数组同样长度的数组
  while(++idex < len){
    result[index] = fn(array[idx], idx, arr);	//应用函数fn到数组中的每一个元素，再把结果放入数组
  }
  return result;
}
```
如上所示，`_.map` 也是基于标准循环的。该函数已经处理了迭代的逻辑，因此无须为一些如循环变量或边界检查这样的琐事而操心，只需关注在迭代函数中功能逻辑的合理性即可。这个例子展示了函数式库如何辅助开发着写出纯函数式的代码。<br />
`map` 是一个只会从左到右遍历的操作，对于从右到左的遍历，必须先反转数组。JavaScript 中的 `Array.reverse()` 操作是不能在这里使用的，因为它会改变原数组。可以将 Lodash 中功能等价的 `reverse` 操作与 `map` 连接起来写成一行：
```javascript
_(persons).reverse().map(
  p => (p !== null && p !== undefinde) ? p.fullname :''
);
```
请注意该例子中语法的细小区别。Lodash 提供了一种不错的非侵入式的方式来与代码继承。开发者所需要做的就是用符号_(...) 将要操作的对象包起来，这样就拥有了其强大功能的完全控制，可以实现任何想要的变换。

> 容器的映射<br/>
> 将数据结构（即例子中的数组）映射为转换后的值，这个理念具有更加深远的意义。正如可以用任意函数映射一个数组，也可以用函数映射一个对象（见第5章）。

现在可以在数据上应用一个变换函数了。如果能够基于新的结构得出某个结果就更好了。这就是 `reduce` 函数要做的事了。

## 用_.reduce收集结果
> `_.reduce` 是 Lodash 库中的一个函数，它对集合中的每个元素执行一个 reducer 函数，并将结果合并为单一的输出值。

这个函数的签名如下：
```javascript
_.reduce(array, [callback(accumulator, value, index, array)], [thisArg])
```

参数解释：
- `array` (Array): 需要遍历的数组。
- `callback` (Function): 执行每个数组元素上的操作的回调函数，接受四个参数： 
   - `accumulator` (Mixed): 累加器累积回调的返回值；
   - `value` (Mixed): 数组中当前正在处理的元素；
   - `index` (Number): 数组中当前正在处理的元素的索引；
   - `array` (Array): 调用 `reduce` 的数组。
- `thisArg` (Mixed): 作为 `callback` 中 `this` 的值使用的对象。

转换数据之后，如何从中收集具有意义的结果呢？假设要从一个 Person 对象集合中计算出人数最多的国家，就可以使用 reduce 函数来实现。<br/>
高阶函数 `reduce` 将一个数组中的元素精简为单一的值。该值是由每个元素与一个累积值通过一个函数计算得出的，如下图所示。
![将数组 reduce 为单一值。每次迭代都会计算出基于先前结果的累积值，直至到达数组的末尾。reduce 的最终结果始终是单一值](../img/function3-fn5.jpg)

上图可以更正式地表示为以下描述：
```javascript
reduce(f,[e0, e1, e2, e3],accum) -> f(f(f(f(acc, e0), e1, e2, e3)))) -> R
```


`_.reduce`的基本实现大致如下：
```javascript
function reduce(collection, iteratee, accumulator) {
  // 确保 collection 是数组或对象
  if (!Array.isArray(collection) && !isLength(collection)) {
    throw new TypeError('Expected the collection to be an array, string or object');
  }
  // 如果提供了初始值，将其作为累加器；否则，从集合的第一个元素开始迭代
  if (arguments.length < 3) {
    accumulator = collection[0];
    collection = collection.slice(1);
  }
  // 迭代集合中的每一个元素
  for (var index in collection) {
    var value = collection[index];
    accumulator = iteratee(accumulator, value, index);
  }
  // 返回累加器的值
  return accumulator;
}
```
这是一个基础的实现，实际上的 `_.reduce`可能会包含更多的错误检查和优化。例如，如果提供的迭代器不是一个函数，Lodash 会抛出一个错误。此外，Lodash 还提供了一些特殊的迭代器函数，如`_.reduceRight`（从右到左迭代集合）， `_.reduceApply`（使用户能够将一个函数作为累加器），等等。<br />这个函数的工作原理是从数组的第一个元素开始，对每个元素应用一个函数，该函数将之前的返回值（初始值为提供的初始值）和当前元素作为参数。在处理完所有元素后，返回最终的返回值。

以下为书中介绍的 `reduce` 的实现
```javascript
function reduce(arr, fn,[accumulator]) {
  let idx = -1,
      len = arr.length;
  if (!accumulator && len > 0) { // 如果不提供累加值，就会用第一个元素作为累加值
    accumulator = arr[++idx];
  }
  while (++idx < len) {
    accumulator = fn(accumulator, // 应用fn到每一个元素，将结果放到累加值中
    arr[idx], idx, arr);
  }
  return accumulator; // 返回累加值
}
```
`reduce` 需要接收以下参数<br/>
 • fn ——迭代函数会应用于数组的每个元素，其参数包含累积值、当前值、当前索引以及数组本身。<br/>
 • 累加器——累积初始值，之后会用于存储每次迭代函数的计算结果，并不断被传入子函数中。<br/>
 
以下是一个简单的例子：
```javascript
const array = [1, 2, 3, 4];
const sum = _.reduce(array, (acc, val) => acc + val);
console.log(sum); // 输出：10
```
上述例子中，我们使用 `_.reduce` 将数组中的所有元素加在一起。回调函数接收两个参数：累加器（`acc`）和当前值（`val`）。在第一次调用回调时，累加器的初始值是第一个元素。然后，每次调用回调时，我们将累加器的值增加当前的值，直到处理完所有元素。最后，我们得到的结果是这些元素的总和。<br/>
下面写一个简单的程序来收集一个 Person 对象数组的一些统计数据。假设要找住在某个特定国家的人数
```javascript
_(persons).reduce(function (stat, person) {
  const country = person.address.country; // 抽取国家信息
  stat[country] = _.isUndefined(stat[country]) ? 1 : stat[country] + 1; // 记录人数，初始为1，每当找到同样国家的同学则加1
  return stat;  // 返回累加值
},{});  //以空对象作为初始累加器
```
这段代码能够将输入的数组转换为表征各国人数的单一对象：
```javascript
{
  'US':2,
  'Greece':1,
  'Hungary':1
}
```
为进一步简化，可以使用普适的 `map-reduce` 组合。通过链接这些函数，并提供具有特定行为的函数参数，就可以提高 `map` 和 `reduce` 函数的威力。抽象地讲，该程序流将具有如下结构：
```javascript
_(persons).map(func1).reduce(func2);
```
其中，func1 和func2 用于实现所需的特定行为。
下面示例结合 `map` 与 `reduce` 进行统计计算 展示了将业务函数与控制流分离的方法
```javascript
const getCountry = person => person.address.country;
const gatherStats = function (stat, criteria) {
  stat[criteria] = _.isUndefined(stat[criteria]) ? 1 : stat[criteria] + 1;
  return stat;
};
_(persons).map(getCountry).reduce(gatherStats, {});
```
这段代码使用 `map` 将对象数组进行预处理，提取出所有国家信息。之后，再使用 `reduce` 来收集最终的结果。这段代码与前面代码具有完全相同的输出，但更加清晰并更具可扩展性。与其直接去访问对象属性，不如考虑（使用Ramda）提供的lens来访问 `address.city` 属性：
```javascript
const cityPath = ['address','city'];
const cityLens = R.lens(R.path(cityPath), R.assocPath(cityPath));
```
这样就能够很容易地基于人们所处的城市计算出结果：
```javascript
_(persons).map(R.view(cityLens)).reduce(gatherStats, {});
```
此外，还可以使用 _.groupBy 函数以一种更加简洁的方式来获得同样的结果：
```javascript
_.groupBy(persons, R.view(cityLens));
```
与 map 不同，由于 `reduce` 依赖于累积的结果，如果不使用满足交换率的操作，从左到右与从右到左的计算可能产生不同的结果。为了说明这一点，考虑一个数组求和的简单程序：
```javascript
_([0,1,3,4,5]).reduce(_.add);   // 13
```
使用反向的操作 `_.reduceRight` 函数也能够获得同样的结果。这是因为加法是一种满足交换律的运算，反之则有可能产生完全不同的结果，比如采用除法运算。如果使用之前的符号描述，`_.reduceRight` 可以作如下表示：

```javascript
reduceRight(f, [e0, e1, e2],accum) -> (e0, f(e1, f(e2, f(e3,accum)))) -> R
```
举例来说，以下两个使用 `_.divide` 的程序将计算出完全不同的结果：
```javascript
([1,3,4,5]).reduce(_.divide) !== ([1,3,4,5]).reduceRight(_.divide);
```
此外，`reduce` 是一个会应用到所有元素的操作，这意味着没有办法将其“短路”来避免其应用于整个数组。假设需要对一组输入值进行校验，也许你会想用 `reduce` 将其转换为一个布尔值来表示所有参数是否合法。但是，使用 `reduce` 会比较低效，因为它会访问列表中的每一个值。其实，一旦找到了一个无效的输入，就不必继续校验剩下的值了。让我们看看如何使用 `_.some` 以及其他如 `_.isUndefined` 和 `_.isNull` 这样的有趣函数来进行更高效的验证。当要应用于列表中的每个元素时，`_.some` 函数能够在找到第一个真值（true ）后立即返回：
```javascript
const isNotValid = val => _.isUndefined(val) || _.isNull(val);  //undefined 与 null 时为不合法
const notAllValid = args => (_(args).some(isNotValid)); //函数 some 会在遍历到第一个 true 时返回 这在寻找数组中是否存在合法值时非常有用
notAllValid (['string', 0, null, undefined]) //false
notAllValid (['string', 0, {}])  // true
```
还可以使用与非全真的逻辑非（也就是全真）函数 `_.every` ，无论对单个元素返回 true 与否，都会检查所有元素。
```javascript
const isValid = val => !_.isUndefined(val) && !_.isNull(val);
const allValid = args => _(args).every(isValid);
allValid(['string', 0, null]); // false
allValid(['string', 0, {}]);  //  true
```
正如前面所看到的，无论是 `map` 还是 `reduce` 都会遍历整个数组。通常并不想处理数据结构中的所有元素，而是期望跳过任何为 `null` 或 `undefined` 的值。要是在计算之前有一个能够去除或过滤掉列表中某些元素的方法就更好了。<br/>
下面介绍 `_.filter` 函数。

## 用_.filter删除不需要的元素
> `_.filter` 是一个用于筛选数组中符合特定条件的元素的函数。它接收两个参数：一个数组和一个断言函数（predicate function）。

断言函数是一个返回布尔值的函数，用于判断数组中的每个元素是否符合筛选条件。当断言函数返回 **`true`** 时，该元素会被保留在筛选后的数组中；当断言函数返回 **`false`** 时，该元素会被排除。<br/>
在处理较大的数据集合时，往往需要删除部分不能参与计算的元素。例如，需要计算只生活在欧洲国家的人或是出生在某一年的人。与其在代码中到处用 `if-else` 语句，不如用 `_.filter` 来实现。<br/>
filter （也称为select ）是一个能够遍历数组中的元素并返回一个新子集数组的高阶函数，其中的元素由谓词函数 p 计算得出的 true 值结果来确定。<br/>
正式的符号描述如下图所示。<br/>
```javascript
filter(p, [d0, d1, d2, d3...dn]) -> [d0,d1,...dn] （输入的子集）
```
![filter 操作以一个数组为输入，并施加一个选择条件 p ，从而产生一个可能较原数组更小的子集。条件p 也称为函数谓词](../img/function3-fn6.jpg)

一种 filter 的实现如下所示<br/>
**filter 的实现**
```javascript
function filter(arr, predicate) {
let idx = -1,
    len = arr.length,
    result = [];  //结果数组为原数组的子集
while (++idx < len) {
  let value = arr[idx];
  if (predicate(value, idx, this)) {  //调用谓词函数，如果结果为真，则保留，否则略过
    result.push(value);
  }
}
return result;
}
```
除了需要提供数组外，`filter` 需要接收一个可用于测试数组中每个元素的 predicate 谓词函数。如果谓词为 true ，则将该元素保留在结果中，否则略过。这就是为什么通常会用 filter 从数组中删除无效数据：<br/>
```javascript
＿(persons).filter(isValid).map(fullname);
```
但它的应用不止如此。假设需要从 `Person` 对象集合中提取生于1903年的人，那么用 `_.filter` 要比使用条件语句更简单明了：
```javascript
const bornIn1903 = person => person.birthYear === 1903;
＿(persons).filter(bornIn1903).map(fullname).join(' and ');
// 'Alonzo Church and Haskell Curry'    
```
> 数组推导式 <br/>
> `map` 和 `filter` 都是能够根据当前数组生成新数组的高阶函数。很多如 `Haskell` 和 `Clojure` 等函数式语言中都能看到它们的身影。组合 `map` 和 `filter` 的另一种方法是使用数组推导式 ——也被称为列表推导式 。这是一种使用关键字 `for…of` 和 `if` 的简明语法并能够将 `map` 和 `filter` 的功能封装在一起的函数式特性：

```javascript
[for (x of iterable) if (condition) x]
```
在撰写本文时，ECMAScript 7 中存在一个增加数组推导式的提议。它能用简洁的表达式来组装新数组（这也就是为什么整个表达式被包裹在 [] 中）。例如，之前的代码可以如下重构：<br/>
```javascript
[for (p of people) if (p.birthYear === 1903) p.fullname].join(' and ');
```

下面是一个使用 **`_.filter`** 的示例：
```javascript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = _.filter(numbers, (num) => num % 2 === 0);
console.log(evenNumbers); // [2, 4]
```
在上面的示例中，我们有一个包含整数的数组 **`numbers`**。我们使用 **`_.filter`** 和一个断言函数来筛选出偶数，并存储在 **`evenNumbers`** 数组中。断言函数检查每个数字是否为偶数，如果是偶数则返回 **`true`**，否则返回 **`false`**。因此，最终的输出为 **`[2, 4]`**，即原始数组中的偶数。

这些技术的应用都基于这些具有扩展性和强大功能的函数，它们不仅有助开发者写出干净的代码，还能够提高开发者对数据的理解。使用声明式的编程风格，开发者可以专注于应用程序的输出，而不是其实现，从而更深地理解应用程序。

# 5、代码推理
回想一下，在JavaScript中，共享着一个全局命名空间的成千上万行代码被一次性加载到单个页面中。尽管最近业务逻辑的模块划分领域得到了越来越多的重视，但仍有数以千计生成中的项目没有这么做。<br/>
那么“代码推理”到底是什么意思呢？之前的章节用“松散”这个词来表征分析一个程序任何一个部分，并建立相应心智模型的难易程度。该模型分为两部分：动态部分包括所有变量的状态和函数的输出，而静态部分包含可读性以及设计的表达水平。两个部分都很重要。读者将在本书中了解到，不可变性和纯函数会使得该模型的构建更加容易。<br/>
之前的内容强调将高阶操作链接起来构成程序的价值。命令式的程序流与函数式的程序流有着本质的不同。函数式的控制流能够在不需要研究任何内部细节的条件下提供该程序意图的清晰结构，这样就能更深刻地了解代码，并获知数据在不同阶段是如何流入和流出的。<br/>
## **声明式惰性计算函数链**
> **声明式惰性计算函数链通常涉及到使用高阶函数、柯里化（currying）和延迟执行等技术。**

第1章中提到，函数式程序是由一些简单函数组成的，尽管每个函数只完成一小部分功能，但组合在一起就能够解决很多复杂的任务。本节将介绍一种能够连接一组函数来构建整个程序的方法。<br/>
函数式编程的声明式模型将程序视为对一些独立的纯函数的求值，从而在必要的抽象层次之上构建出流畅且表达清晰的代码。这样就可以构成一个能够清晰表达应用程序意图的本体或词汇表。使用如 map 、reduce 和 filter 这样的基石来搭建纯函数，可使代码易于推理并一目了然。<br/>
这个层次的抽象的强大之处在于，它会使开发者开始认识到各种操作应该对所采用的底层数据结构不可见。从理论上说，无论是使用数组、链表、二叉树还是其他数据结构，它都不应该改变程序原本的语义。正是出于这个原因，函数式编程选择更关注于操作而不是数据结构。<br/>
下面是一个简单的例子，展示了如何使用这些技术来创建一个声明式惰性计算函数链：
```javascript
// 声明一个简单的柯里化函数，用于计算阶乘
function factorial(n) {
  return function(m) {
    return n * m;
  };
}

// 使用柯里化函数来创建阶乘函数
const factorial5 = factorial(5);

// 使用阶乘函数计算结果
console.log(factorial5(10)); // 输出 5 * 10 = 50

// 声明一个惰性计算的函数，它使用柯里化函数进行计算
function lazyFactorial(n) {
  const factorial = (n) => (m) => n * m;
  return function(m) {
    return factorial(n)(m);
  };
}

// 使用惰性计算的函数来创建阶乘函数
const lazyFactorial5 = lazyFactorial(5);

// 在需要的时候进行计算
console.log(lazyFactorial5(10)); // 输出 5 * 10 = 50
console.log(lazyFactorial5(20)); // 输出 5 * 20 = 100
```
在上面的例子中，`factorial` 是一个柯里化函数，它返回一个新的函数，这个新的函数会计算阶乘。`lazyFactorial` 是一个惰性计算的函数，它使用柯里化函数来创建一个新的函数，这个新的函数会在需要的时候进行计算。<br />
**Lodash的惰性计算函数链**<br />
Lodash 的 `_.chain` 方法可以创建一个惰性函数链。这个函数链允许使用链式编程（Chaining）的方式来组织一系列的函数调用。<br />
当使用 `_.chain` 方法时，Lodash 会返回一个新的函数。这个新函数会包装我们的原始函数，并将所有的操作都缓存起来，直到调用这个新函数的执行方法（例如 `.value()` 或 `.run()`）。<br />
举个例子，假设我们有一个简单的加法函数：
```javascript
function add(a, b) {
  return a + b;
}
```
使用 `_.chain` 方法，我们可以将其包装为一个惰性函数链：
```javascript
const _ = require('lodash');
const chainedAdd = _.chain(add);
```
现在，`chainedAdd` 是一个包装过的函数，它允许我们使用链式编程的方式来进行操作：
```javascript
const result = chainedAdd(1)(2).value(); // result is 3
```
上述例子中，`chainedAdd(1)` 返回一个新的函数，它记住了 `add` 函数和第一个参数 `1`。然后，我们将第二个参数 `2` 传递给这个新函数，并调用 `.value()` 方法来执行这个惰性函数链。最后，我们得到了结果 `3`。

惰性计算的一个主要优点是它可以避免不必要的计算。例如，如果你有一个函数链，其中有一些操作是相互独立的，那么使用惰性计算可以确保这些操作只在必要的时候才会执行。这可以提高程序的性能和效率。


## **类SQL的数据：函数即数据**

本章已经介绍了各种各样的函数，比如map 、reduce 、filter 、groupBy 、sortBy 、uniq 等。将这些函数组成一个列表，可用来梳理数据相关的信息。如果在更高层面细细思考，就会发现这些函数与SQL相似，这不是偶然的。<br/>

开发者惯于使用SQL及其功能来了解和梳理数据的含义。例如，可以用下表所示的内容来表示person对象的集合。
![表格化的person数据表示](../img/function3-fn7.jpg)

事实证明，在构建程序时，使用查询语言来思考与函数式编程中操作数组类似——使用通用关键字表或代数方法来增强对数据及其结构的深层次思考。下面的SQL查询语句

```sql
SELECT p.firstname, p.birthYear FROM Person p
WHERE p.birthYear > 1903 and p.country IS NOT 'US'
GROUP BY p.firstname, p.birthYear
```
使开发者能够清楚地看到运行此代码后数据是什么样子的。在实现此程序的 JavaScript 版本之前，先设置一些函数别名来辅助说明这一点。Lodash支持一种称为mixins 的功能，可以用来为核心库扩展新的函数，并使得它们可以以相同的方式连接：
```javascript
_.mixin({'select': _.pluck,
          'from': _.chain,
          'where': _.filter,
          'groupBy': _.sortByOrder});  
```
应用此 mixin 对象后，就可以编写出如下所示的程序。
类似 SQL 的 JavaScript 代码
```javascript
_.from(persons)
  .where(p => p.birthYear > 1900 && p.address.country !== 'US')
  .groupBy(['firstname', 'birthYear'])
  .select('firstname', 'birthYear')
  .value();
  // ['Alan', 'Barkley', 'John']
```
上述示例中，创建了一个SQL关键字到对应别名函数的映射，从而可以更深刻地理解一个查询语言的函数式特性。<br/>
**JavaScript中的mixin**<br/>
mixin 是定义与特定类型（也就是上例中 SQL 命令）相关的函数的抽象子集对象。该对象在代码中不会被直接使用，而是作为对另一个对象行为的扩展（它有点类似于其他编程语言中的特质）。目标对象则能够使用 mixin 中的各种功能。<br/>
在面向对象的世界中，除了继承或者在不支持的语言中（比如 JavaScript 就是其中之一）模拟地多重继承，mixin是另一种代码重用的方式。本书中过多地介绍mixin，但如果能够正确使用，它会很强大。更多关于mixin的信息，参见[https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins](https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins)。

> Lodash 的 mixins 是一种将自定义功能添加到 Lodash 库中的机制。通过 mixins，您可以将自己的函数与 Lodash 的核心函数混合在一起，以扩展 Lodash 的功能。

在类SQL的数据模型中，mixins可以被视为一种将函数和数据结合在一起的机制。通过mixins，我们可以将一些函数定义为数据的一部分，并将它们与表中的数据进行关联。<br />
例如，假设我们有一个"users"表，其中包含用户的姓名、年龄和电子邮件地址等数据。我们可以创建一个mixin，将一些与用户相关的函数定义为该表的一部分。这些函数可以包括验证电子邮件地址是否有效、生成密码哈希值或检查用户是否符合特定条件的函数<br />
通过将这些函数定义为mixins，我们可以将它们与表中的数据进行关联，并在查询中使用它们。例如，我们可以编写一个查询来选择年龄大于18岁并且电子邮件地址有效的用户。在这种情况下，我们可以使用mixin中定义的函数来验证电子邮件地址是否有效，并将它们与表中的数据进行关联。<br />
总的来说，mixins提供了一种将函数和数据结合在一起的方法，以扩展类SQL的数据模型的功能。通过将函数定义为mixins，我们可以将它们与表中的数据进行关联，并在查询中使用它们来执行更复杂的操作。<br />
**要创建 Lodash mixins，您需要遵循一些简单的规则和最佳实践：**
1. **将自定义函数放在一个对象中，该对象将作为 mixin 传递给 `_.mixin()` 方法。**
2. **确保自定义函数具有适当的命名，以避免与 Lodash 的核心函数发生冲突。**
3. **自定义函数应该使用 Lodash 的核心函数来实现其功能。**
4. **避免在 mixin 中覆盖 Lodash 的核心函数。**
5. **在 mixin 对象中使用一个属性 `length` 来指定应该从调用函数中排除的参数数量。**

**下面是一个简单的示例，演示如何创建一个 Lodash mixin：**
```javascript
// 自定义函数
function greet(name) {
  console.log(`Hello, ${name}!`);
}

// 创建 mixin 对象
const myMixin = {
  greet: greet,
};

// 将 mixin 添加到 Lodash 库中
_.mixin(myMixin);

// 使用 mixin 中的函数
_.greet('John'); // 输出：Hello, John!
```
通过将自定义函数添加到 mixin 对象中，并使用 `_.mixin()` 方法将其添加到 Lodash 库中，您就可以在您的代码中使用这些自定义函数，就像它们是 Lodash 核心函数一样。<br />
现在读者应该相信，函数式编程的抽象能力比命令式代码更加强大。还有比使用查询语言的语义来处理和解析数据更好的方法吗？像SQL一样，上面的 JavaScript 代码以函数的形式对数据进行建模，也就是函数即数据 。因为它是声明式的，描述了数据输出是什么 ，而不是数据是如何得到的 。到目前为止，并不需要任何常见的循环语句——本书的其余部分也不打算使用它们。相反，应该用高阶抽象代替循环。<br />
另一种用于替换循环的常见技术是递归，尤其当处理一些“自相似”的问题时，可以用其来抽象迭代。对于这些类型的问题，序列函数链会显得效率低下或不适用。而递归实现了自己的处理数据的方式，从而大大缩短了标准循环的执行时间。

# 6、学会递归地思考
有时，要解决的问题是困难且复杂的。这种情况下，开发者应该立刻去寻找方法来分解它。如果问题可以分解成较小的问题，就可以逐个解决，再将这些结论组合起来构建出整个问题的解决方案。在Haskell、Scheme和Erlang这样的纯函数编程语言中，数组遍历是不能没有递归的，因为这些语言根本没有循环结构。<br/>
而在JavaScript中，递归具有许多应用场景，例如解析XML、HTML文档或图形等。本节将解释什么是递归，然后通过一个练习教读者如何去递归地思考，最后将概述可以使用递归解析的几种数据结构。<br/>
## **递归（Recursion）**
递归是函数式编程的一个重要组成部分，它涉及到函数自我调用的概念。递归可以用于解决许多问题，包括计算阶乘、斐波那契数列、树的遍历等等。<br />
递归是一种旨在通过将问题分解成较小的自相似问题来解决问题本身的技术，将这些小的自相似问题结合在一起，就可以得到最终的解决方案。递归函数包含以下两个主要部分。<br />
•  基例（也称为终止条件）。<br />
•  递归条件。<br />
基例是能够令递归函数计算出具体结果的一组输入，而不必再重复下去。递归条件则处理函数调用自身的一组输入（必须小于原始值）。如果输入不变小，那么递归就会无限期地运行，直至程序崩溃。随着函数的递归，输入会无条件地变小，最终到达触发基例的条件，以一个值作为递归过程的终止。<br />
第2章使用递归来深度冻结整个嵌套的对象结构。如果遇到的对象是基本类型或已经被冻结，就会触发基例；否则，就会继续遍历对象结构，因为发现了更多未被冻结的对象。递归很适合处理这种问题，因为在任何一个层次上，要解决的任务是完全一样的。但是，递归思考可能会是一个挑战，下面开始吧。<br />

## **学会递归地思考**
递归的思考方式，其实就像解决生活中的问题一样，也需要分解问题，逐步解决。例如，如果我们有一个大的任务需要完成，我们可以将其分解为几个小任务，然后分别完成这些小任务。同样，在递归中，我们也需要将一个大问题分解为几个小问题，然后逐个解决这些小问题，最终解决大问题。<br />
递归不是一个容易掌握的概念。与函数式编程一样，最难的部分是忘记常规的方法。本书的重点不是让读者成为一个递归大师，因为它不是一种常用的技术手段。但重要的是，本书期望通过它来锻炼读者的大脑，并帮助读者更好地学习如何分析可递归的问题。<br />
递归地思考需要考虑递归自身以及自身的一个修改版本。递归对象是自定义的。例如，想象将树枝组合成一棵树。一个树枝有叶子以及其他的树枝，而它们又有更多的叶子和更多的树枝。这个过程将无限地持续下去，只有在达到外部限制时才会停止，本例中就是树的大小。<br />
下面基于这一思想来解决一个简单的问题：对数组中的所有数求和。先实现命令式的版本，再实现函数式的版本。命令式的大脑可以自然而然地形成一个解决方案，遍历数组并不断地累积一个值：<br />
数组中的所有数求和。
```javascript
var acc = 0;
for(let i = 0; i < nums.length; i++){
  acc += nums[i];
}
```
通常开发者会使用一个累加器，因为要计算一个总和时，这绝对是必要的。但是需要使用循环吗？在这一点上，开发者很清楚可以使用函数式的武器（例如_.reduce ）：
```javascript
_(nums).reduce((acc, current) => acc + current, 0);
```
将循环抽成框架，可以将应用程序代码抽象出来。但是可以做得更好，从代码中彻底移除迭代。使用函数 _.reduce 无须考虑循环，甚至是数组的大小。可以通过将第一个元素添加到其余部分来计算结果，从而实现递归思维。这种思想过程可以想象成如下的序列求和操作，这被称为横向思维：
```javascript
sum[1,2,3,4,5,6,7,8,9] = 1 + sum[2,3,4,5,6,7,8,9]
                       = 1 + 2 + sum[3,4,5,6,7,8,9]
                       = 1 + 2 + 3 + sum[4,5,6,7,8,9]
```
递归和迭代是一枚硬币的两面。在不可变的条件下，递归提供了一种更具表现力、强大且优秀的迭代替代方法。事实上，纯函数式语言甚至没有标准的循环结构，如 do 、for 和 while ，因为所有循环都是递归完成的。递归使代码更易理解，因为它是以多次在较小的输入上重复相同的操作为基础的。下面示例中的递归解决方案使用 Lodash 的 _.first 和 _.rest 函数分别访问数组的第一个元素和剩余元素。<br/>
递归求和
```javascript
function sum(arr) {
  if(_.isEmpty(arr)) { //基例（终止条件）
    return 0;
  }
  return _.first(arr) + sum(_.rest(arr)); // 递归条件：使用更小一些的输入集调用自身。这里通过_.first和_.rest 缩减输入集
}
sum([]); //-> 0
sum([1,2,3,4,5,6,7,8,9]); //->45
```
空数组会满足基例，返回 0。而对于非空数组，就会继续将第一个元素与数组的其余部分递归地求和。从底层来看，递归调用会在栈中不断堆叠。当算法满足终止条件时，运行时就会展开调用栈并执行加操作，因此所有返回语句都将被执行。递归就是通过语言运行时这种机制代替了循环。<br/>
以下是算法实现的步骤视图：
```javascript
1 + sum[2,3,4,5,6,7,8,9]
1 + 2 +sum[3,4,5,6,7,8,9]
1 + 2 + 3 + sum[4,5,6,7,8,9]
1 + 2 + 3 + 4 + sum[5,6,7,8,9]
1 + 2 + 3 + 4 + 5 + sum[6,7,8,9]
1 + 2 + 3 + 4 + 5 + 6 + sum[7,8,9]
1 + 2 + 3 + 4 + 5 + 6 + 7 + sum[8,9]
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + sum[9]
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + sum[]
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 0   //->halts, stack unwinds
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9
1 + 2 + 3 + 4 + 5 + 6 + 7 + 17
1 + 2 + 3 + 4 + 5 + 6 + 24
1 + 2 + 3 + 4 + 5 + 30
1 + 2 + 3 + 4 + 35
1 + 2 + 3 + 39
1 + 2 + 42
1 + 44
45
```
看到这里，自然要考虑一下递归和迭代的性能问题。毕竟，编译器在处理循环的优化问题上是非常强大的。JavaScript 的 ES6 带来了一种称之为尾调用优化 的优化功能，可以使递归和迭代的性能表现更加接近。考虑一个稍微有所不同的sum 实现：

```javascript
function sum(arr, acc = 0) {
  if(_.isEmpty(arr)) {
    return 0;
  }
  return sum(_.rest(arr), acc + _.first(arr)); //<---发生在尾部的递归调用
}
```
这个版本的实现将递归调用作为函数体中最后的步骤，也就是尾部位置。在第7章讨论函数式优化问题时，我们会探索这样做的好处。


## 递归定义的数据结构
> 递归定义的数据结构主要有栈和树

栈是一种具有特殊性质的数据结构，其操作方式主要是后进先出（LIFO），即最后添加到栈中的元素最先被取出。递归在栈中的应用主要体现在活动记录和递归调用上，每次方法调用都会创建一个新的活动记录，将方法调用的状态和局部变量压入栈中，当方法返回时，再从栈中弹出活动记录，恢复方法调用的状态，继续执行后续代码。

树是一种非线性数据结构，由节点和边组成，其中节点表示元素，边表示节点之间的父子关系。递归在树中的应用主要体现在树的遍历上，例如二叉树的深度优先遍历和广度优先遍历，都可以使用递归实现。在深度优先遍历中，递归函数会根据当前节点的状态进行不同的操作，例如对于叶子节点，直接返回；对于左子节点，递归调用深度优先遍历函数；对于右子节点，递归调用深度优先遍历函数。在广度优先遍历中，递归函数会依次访问每个节点的左子节点和右子节点，然后再访问其父节点。

总的来说，递归在数据结构中的应用能够使代码更加简洁、易于理解和维护。

读者可能想知道person 对象示例数据中的那些名字。20世纪 20 年代，函数式编程（lambda 演算、范畴论等）背后的数学社区非常活跃。大部分发表的研究成果都是融合一些由Alonzo Church 这样的知名大学教授提出的思想和定理。事实上，许多数学家，如Barkley Rosser、Alan Turing和Stephen Kleene等，都是Church 的博士生。后来他们也有了自己的博士生。下图为这种师徒关系（的一部分）的示意图。
![函数式编程发展历程中具有杰出贡献和影响力的数学家。树形结构中从父节点到子节点的连线代表了“是其学生”这种关系](../img/function3-fn8.jpg)

这种结构在软件中是很寻常的，它可用于建模XML文档、文件系统、分类法、种别、菜单部件、逐级导航、社交图谱等，所以学习如何处理它们至关重要。上图显示了一组节点，其连线表示了导师-学生这一关系。到目前为止，我们已经利用函数式技术解析过一些扁平化的数据结构，如数组。但这些操作对树形数据是无效的。因为 JavaScript 没有内置的树型对象，所以需要基于节点创建一种简单的数据结构。节点是一种包含了当前值、父节点引用以及子节点数组的对象。在上图中，Rosser 的父节点是 Church ，其子节点有 Mendelson 和 Sacks 。如果一个节点没有父节点，比如 Church ，则被称为根节点。以下是节点 类型的定义，代码如下所示。<br/>
节点对象

```javascript
class Node {
  constructor(val) {
    this._val = val;
    this._parent = null;
    this._children = [];
  }
  isRoot() {
    return isValid(this._parent); //<---之前创建的函数
  }
  get children() {
    return this._children;
  }
  hasChildren() {
    return this._children.length > 0;
  }
  get value() {
    return this._val;
  }
  set value(val) {
    this._val = val;
  }
  append(child) {
    child._parent = this; //<--- 设置父节点
    this._children.push(child); //<---孩子节点加入孩子列表中
    return this; //<--- 返回该节点（便于方法级联）
  }
  toString() {
    return `Node (val: ${this._val}, children:${this._children.length})`;
  }
}
```
可以这样创建一个新节点：
```javascript
const church = new Node(new Person('Alonzo', 'Church', '111-11-1111'));// <--- 重复树中的所有节点
```
树是包含了一个根节点的递归定义的数据结构：
```javascript
class Tree {
  constructor(root) {
    this._root = root;
  }
  static map(node, fn, tree = null) { //<---使用静态方法以免与Array.prototype.map混淆。静态方法也能像单例函数一样高效
    node.value = fn(node.value);  //<---调用遍历器函数，并更新树中的节点值
    if(tree === null) {
      tree = new Tree(node);  //<---与 Array.prototype.map 类似。结果是一个新的结构
    }
    if(node.hasChildren()) { //<---如果节点没有孩子，则返回（基例）
      _.map(node.children, function (child) { //<---将函数应用到每一个孩子节点
        Tree.map(child, fn, tree); //<--- 递归地调用每一个孩子节点
      });
    }
    return tree;
  }
  get root() {
  return this._root;
  }
}
```
节点的主要逻辑在于 append 方法。要给一个节点追加一个子节点，需要将该节点设置为子节点的 parent 引用，并把子节点添加至该节点的子节点列表中。通过从根部不断地将节点链接到其他子节点来填充一棵树，由 church 开始：
```javascript
church.append(rosser).append(turing).append(kleene);
kleene.append(nelson).append(constable);
rosser.append(mendelson).append(sacks);
turing.append(gandy);
```

每个节点都包裹着一个 person 对象。递归算法执行整个树的先序遍历，从根开始并且下降到所有子节点。由于其自相似性，从根节点遍历树和从任何节点遍历子树是完全一样的，这就是递归定义。为此，可以使用与 Array.prototype.map 语义类似的高阶函数 Tree.map ——它接收一个对每个节点求值的函数。可以看出，无论用什么数据结构来建模（这里是树形数据结构），该函数的语义应该保持不变。从本质上讲，任何数据类型都可以使用map并保持其结构不变。本书第5章会更正式地介绍这种保持数据结构的映射函数。<br/>
树的先序遍历按照以下步骤执行，从根节点开始。<br/>
1）显示根元素的数据部分。<br/>
2）通过递归地调用先序函数来遍历左子树。<br/>
3）以相同的方式遍历右子树。<br/>
下图显示了算法采用的路径。<br/>
![递归的先序遍历，从根节点开始，一直向左下降，然后再向右移动](../img/function3-fn9.jpg)
函数 Tree.map 有两个必需的输入：根节点（即树的开始）以及转换每个节点数值的迭代函数：
```javascript
Tree.map(church, p => p.fullname);
```
它以先序方式遍历树，并将给定的函数应用于每个节点，输出以下结果：
```javascript
'Alonzo Church', 'Barkley Rosser', 'Elliot Mendelson', 'Gerald Sacks', 'Alan Turing', 'Robin Gandy', 'Stephen Kleene', 'Nels Nelson', 'Robert Constable'
```
在操作不可变、无副作用的数据类型时，封装数据以控制其访问的思想是函数式编程的关键。本书第5章将进一步介绍这一思想。解析数据结构是软件和函数式编程最基本的方面之一。本章更深入地探讨了利用可扩展函数库（即Lodash）中的函数式特性来进行函数式风格的 JavaScript 开发。这种风格有利于流式建模，将包含业务逻辑的高阶操作连接在一起，从而达到最终的业务目的。
不可否认的是，编写流式风格的代码也有利于可重用性和模块化，但目前的讨论还比较浅显。本书第4章更深入地介绍流式编程，将重点放在构建真正的函数管道上。


# 总结
1、高阶函数，如 map、reduce 和 filter，是函数式编程的重要组成部分，也是提高代码可扩展性的重要工具。这些函数可以接收其他函数作为参数，或者返回一个函数作为结果，从而让代码更加模块化和可复用。<br />
2、Lodash是一个非常流行的工具库，它提供了许多有用的函数来处理数组、对象和其他数据类型。通过使用Lodash，我们可以更轻松地处理数据，同时可以创建控制流和数据交换明确分离的程序。<br />
3、使用声明式的函数式编程可以帮助我们编写更易理解、可维护和可扩展的程序。它强调的是计算结果值，而不是副作用和状态变化，这使得代码更加简洁、可读性更好、可维护性更强。<br />
4、可以通过编写函数将高阶抽象映射到SQL语句，从而更深入地理解数据。这种抽象映射可以帮助简化SQL语句的编写和执行，提高代码的可读性和可维护性。<br />
5、递归在计算机科学中是一种非常强大的解决问题的方法，它可以用来解决许多复杂的问题，包括自相似问题。
