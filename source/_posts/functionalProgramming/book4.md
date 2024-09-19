---
title: 《JavaScript函数式编程指南》第四章 模块化且可重⽤的代码
date: 2023-12-05 12:00:00
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---

# 第四章 模块化且可重⽤的代码

> 模块化是⼤型软件项⽬最重要的特性之⼀，它代表了将程序分成较⼩独⽴部分的程度。模块化程序的独特之处在于，其含义来⾃于其组成部分的性质。这些部分（称为⼦程序）都是可重复使⽤的组件，并可以合并为⼀个系统整体或单独在其他系统中使⽤。这使代码更加可读和可维护，同时使开发更加⾼效。
## 本章内容
> 函数链与函数管道的⽐较
> Ramda.js 函数库
> 柯⾥化、部分应⽤（partial application）和函数绑定
> 通过函数式组合构建模块化程序
> 利⽤函数组合⼦增强程序的控制流
## ⽅法链与函数管道的⽐较
>⽅法链接（紧耦合，有限的表现⼒）。
>函数的管道化（松耦合，灵活）。

### 什么是函数管道化
函数管道化是一种编程技术，它将多个函数组合在一起，使它们按照一定的顺序依次执行，并将前一个函数的输出作为后一个函数的输入。这种方式可以将复杂的问题分解成简单的步骤，每个步骤都由一个函数来完成，从而使代码更加模块化和易于维护。
函数管道化还可以提高代码的可读性和可重用性，因为每个函数都可以单独测试和调试。
在函数式编程中，函数管道化是一个常见的技术，它可以帮助程序员更好地利用函数的组合性质。

### ⽅法链与函数管道的区别
方法链接和管道都是将多个操作连接在一起的方式，但它们之间有一些区别。
1.方法链接
方法链接是一种将多个方法链接在一起的方式，其中每个方法都会对前一个方法的结果进行操作。这种链接方式通常用于函数式编程中，可以让代码更加简洁和可读。例如，在JavaScript中，可以使用方法链接来对数组进行操作，如下所示：

```javascript
_.chain(names)
 .filter(isValid) 
 .map(s => s.replace(/_/, ' '))
 .uniq()
 .map(_.startCase)
 .sort()
 .value();
```
每⼀个“点”后只能调⽤ Lodash 提供的⽅法
![数组的⽅法链需要通过调⽤所属对象中的⽅法来实现。⽽从内部来看，每个⽅法都会返回⼀个含有调⽤结果的新数组。](../img/function4-fn1.png)


从⾼阶函数⾓度来看，打破函数链的约束就能够⾃由地排列所有独⽴的函数操作，⽽可以使⽤函数管道来实现这⼀⽬的。

2.函数管道
函数式编程能够消除⽅法链中存在的限制，使得任何函数的组合都更加灵活。管道是松散结合的有向函数序列，⼀个函数的输出会作为下⼀个函数的输⼊。
![函数管道始于具有类型 A 参数的函数 f ，产⽣⼀个类型 B 的对象，随后按序传⼊函数 g ，并以输出的类型 C 对象作为最终结果。函数f 和 g 既可以来⾃于任何函数库，也可以是⾃定义的函数](../img/function4-fn2.png)
此模式就是许多企业应⽤程序中都能够看到的⾯向对象设计模式中的管道与过滤器模式，它是从函数式编程衍变⽽来的（其中的过滤器就是各个函数）。

⽅法链接通过对象的⽅法紧密连接；⽽管道以函数作为组件，将函数的输⼊和输出松散地连接在⼀起。但是，为了实现管道，被连接的函数必须在元数（arity）和类型上相互兼容。

## 管道函数的兼容条件
> 类型——函数的返回类型必须与接收函数的参数类型相匹配。
> 元数——接收函数必须声明⾄少⼀个参数才能处理上⼀个函数的返回值。

1.类型
由于JavaScirpt是弱类型语⾔，因此从类型⾓度来看，⽆须像使⽤⼀些静态类型语⾔⼀样太过关注类型。但开发者仍然需要了解⼀个函数所期望的参数类型。使⽤清晰的定义。举例：

```javascript
function addOne(num: number): number {
  return num + 1;
}

function toString(num: number): string {
  return num.toString();
}
```
这两个函数的输入和输出类型都是明确的。现在我们想要将它们组合成一个管道函数：

```javascript
function addOneAndToString(num: number): string {
  return toString(addOne(num));
}
```
这个管道函数的输入类型是 number，输出类型是 string。因此，如果我们想要将它与另一个函数组合起来，那么这个函数的输入类型必须是 string，输出类型可以是任何类型，因为这是管道函数的最终输出类型。如果我们稍微修改一下 toString 函数：

```javascript
function toString(num: number | string): string {
  return num.toString();
}
```
现在这个函数的输入类型是 number | string，输出类型仍然是 string。那么我们就可以将它与 addOneAndToString 组合起来：

```javascript
function addOneAndToString(num: number| string): string {
  return toString(addOne(num));
}
```

2.元数
元数定义为函数所接收的参数数量，也被称为函数的⻓度（length）。
```javascript
// isValid :: String -> Boolean
function isValid(str) { //使⽤简单
 ...
}
// makeAsyncHttp:: String, String, Array -> Boolean
function makeAsyncHttp (method, url, data) { //难以使⽤，因为必须先计算出所有参数
 ...
}

```
只具有单⼀参数的纯函数是最简单的，因为其实现⽬的⾮常单纯，也就意味着职责单⼀。因此，应该尽可能地使⽤具有少量参数的函数，这样的函数更加灵活和通⽤。然⽽，总是使⽤⼀元函数并⾮那么容易。例如，在真实世界中，isValid 函数可能会额外返回⼀个描述错误信息的值：
```javascript
isValid :: String -> (Boolean, String) //返回含有验证状态或错误信息的结构体
isValid(' 444-444-44444'); //-> (false, 'Input is too long!')

```
想要返回两个值的话，此时就用到了元组。
元组是一个描述定长数组的类型，数组的各项可以类型不同。
```javascript
return {
 status : false, 
 message: 'Input is too long!'
};
//或者
 return [false, 'Input is too long!'];
```
1、不可变的——⼀旦创建，就⽆法改变⼀个元组的内部内容。
2、避免创建临时类型——元组可以将可能毫不相关的数据相关联。⽽定义和实例化⼀些仅⽤于数据分组的新类型使得模型复杂并令⼈费解。
3、避免创建异构数组——包含不同类型元素的数组使⽤起来颇为困难，因为会导致代码中充满⼤量的防御性类型检查。传统上，数组意在存储相同类型的对象。


JavaScript并不原⽣地⽀持Tuple 数据类型。但是，JavaScript已经提供了实现元组所需的所有⼯具，Tuple 数据类型
```javascript
const Tuple = function( /* types */ ) {
 const typeInfo = Array.prototype.slice.call(arguments, 0); //读取参数作为元组的元素类型


 const _T = function( /* values */ ) { //声明内部类型_T，以保障类型与值匹配
 const values = Array.prototype.slice.call(arguments, 0); //提取参数作为元组内的值

  //检查⾮空值。函数式数据类型不允许空值
  if(values.some((val) => val === null || val === undefined)) {
    throw new ReferenceError('Tuples may not have any null values');
  }
  if(values.length !== typeInfo.length) { //按照定义类型的个数检查元组的元数
    throw new TypeError('Tuple arity does not match its prototype');
  }
  values.map(function(val, index) { //使⽤ checkType 检查每⼀个值都能匹配其类型定义。
  //其中的元素都可以通过_n 获取， n 为元素的索引（注意是从1 开始）
  this['_' + (index + 1)] = checkType(typeInfo[index])(val);
  }, this);
  Object.freeze(this); //让元组实例不可变
 };

 _T.prototype.values = function() { //提取元组中的元素，也可以使⽤ES6 的解构赋值把元素赋值到变量上
  return Object.keys(this).map(function(k) {
    return this[k];
  }, this);
 };
 return _T;
};

```
使用举例：
```javascript
const StringPair = Tuple(String, String);
const name = new StringPair('Barkley', 'Rosser');
[first, last] = name.values();
first; //-> 'Barkley'
last; //-> 'Rosser'
const fullname = new StringPair('J', 'Barkley', 'Rosser'); //抛出元素不匹配的错误
```

元组是减少函数元数的⽅式之⼀，但还可以使⽤更好的⽅式去应对那些不适于元组的情况。通过引⼊函数柯⾥化不仅可以降低元数，还可以增强代码的模块化和可重⽤性。


## 柯⾥化的函数求值
JavaScript是允许在缺少参数的情况下对常规或⾮柯⾥化函数进⾏调⽤的。换句话说，如果定义⼀个函数f(a, b, c) ，并只在调⽤时传递a ，JavaScript运⾏时的调⽤机制会将b 和c 设为undefined
![再看柯⾥化函数，它要求所有参数都被明确地定义，因此当使⽤部分参数调⽤时，它会返回⼀个新的函数，在真正运⾏之前等待外部提供其余的参数。](../img/function4-fn3.png)

![柯⾥化函数 f 的求值。只有提供了所有参数，该函数才会输出具体的结果，否则它会返回另⼀个等待参数传递的函数](../img/function4-fn4.png)


```javascript
function add(a, b) {  return a + b;}
function curryingAdd(a) {  return function(b) {    return a + b;  }}
add(1, 2); // 3
curryingAdd(1)(2); // 3
```
由于JavaScript本⾝不⽀持⾃动柯⾥化函数，因此需要编写⼀些代码来启⽤它。⼆元参数的⼿动柯⾥化
```javascript
function curry2(fn) {
 return function(firstArg) { //第⼀次调⽤ curry2，获得第⼀个参数
  return function(secondArg) { //第⼆次调⽤获得第⼆个参数
    return fn(firstArg, secondArg); //将两个参数应⽤到函数 fn 上
  };
 };
}

```
如上所⽰，柯⾥化是⼀种词法作⽤域（闭包），其返回的函数只不过是⼀个接收后续参数的简单嵌套函数包装器。以下是⼀个简单应⽤：
```javascript
const name = curry2(function (last, first) {
 return new StringPair('Barkley', 'Rosser');
});
[first, last] = name('Curry')('Haskell').values(); //当给定两个参数时，函数会完全求值
first;//-> 'Curry'
last; //-> 'Haskell'
name('Curry'); //-> Function <--- 当只提供⼀个参数时，返回⼀个函数，⽽不是将第⼆个参数当作 undefined
```

### 函数式库Ramda.js
像 Lodash ⼀样，Ramda.js拥有众多可⽤于连接函数式程序的有⽤函数，并且对纯函数式编码⻛格提供了⽀持。之所以使⽤它，是因为可以很容易地实现参数柯⾥化、惰性应⽤和函数组合（参⻅本章后⾯的内容）。


跟其他函数库区别
其一：Lodash/underscore 的函数库，因为它的很多函数把需要处理的参数放在了首位（ 例如 `map` ）这里推荐使用 Ramda，它应该是目前最符合函数式编程的工具库，它需要操作的数据参数都是放在最后的。

其二：柯里化：Ramda 几乎所有的函数都是自动柯里化的。也即可以使用函数必需参数的子集来调用函数，这会返回一个接受剩余参数的新函数。当所有参数都传入后，原始函数才被调用。
```javascript
const isOdd = (n) => n % 2 === 1;

R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]

R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
```

柯⾥化的实际应⽤场景：实现可重⽤模块化函数模板。
### 创建可重⽤的函数模板。
创建⼀个⽇志函数模板
```javascript
const logger = function(appender, layout, name, level, message) {
 const appenders = { //预设 appenders
 'alert': new Log4js.JSAlertAppender(),
 'console': new Log4js.BrowserConsoleAppender()
 };
 const layouts = { //预设布局layouts
 'basic': new Log4js.BasicLayout(),
 'json': new Log4js.JSONLayout(),
 'xml' : new Log4js.XMLLayout()
 };
 const appender = appenders[appender];
 appender.setLayout(layouts[layout]);
 const logger = new Log4js.getLogger(name);
 logger.addAppender(appender);
 logger.log(level, message, null); //使⽤配置好的logger 打印消息
};
```
通过柯⾥化logger ，可以集中管理和重⽤适⽤于任何场合的⽇志配置：
```javascript
const log = R.curry(logger)('alert', 'json', 'FJS'); //只会应⽤第⼀个参数到函数 logger
log('ERROR', 'Error condition detected!!');
// -> this will popup an alert dialog with the requested message
```
如果要在⼀个函数或⽂件中记录多条错误⽇志，可以灵活地设置除最后⼀个参数之外的其他参数：

```javascript
const logError = R.curry(logger)('console', 'basic', 'FJS','ERROR');
logError('Error code 404 detected!!');
logError('Error code 402 detected!!');
```
curry 函数的后续调⽤在后台被执⾏，最终⽣产⼀个⼀元函数。

除了能够有效提升代码的可重⽤性之外，将多元函数转换为⼀元函数才是柯⾥化的主要动机。柯⾥化的可替代⽅案是部分应⽤和函数绑定，它们受到JavaScript语⾔的适度⽀持，以产⽣更⼩的功能，在插⼊功能管道时也能很好地⼯作。

## 部分应用和函数绑定

部分应⽤是⼀种通过将函数的不可变参数⼦集初始化为固定值来创建更⼩元数函数的操作。简单来说，如果存在⼀个具有五个参数的函数，给出三个参数后，就会得到⼀个、两个参数的函数。

许多语言支持可选参数，但是Javascript不支持。Javascript采用一种完全不同的模式，它任允许意数量的参数传给函数。
部分应用在Javascript中的处理方式是：给函数的一个或多个参数绑定上值，然后返回另一个函数接受剩余的未绑定参数。 同样，珂理化的处理方式是把一个有多个参数的函数转换为一个只接受一个参数的函数，它返回的函数接受剩余的参数。

和柯里化区别：
1、柯⾥化在每次分步调⽤时都会⽣成嵌套的⼀元函数。在底层，函数的最终结果是由这些⼀元函数的逐步组合产⽣的。同时，curry 的变体允许同时传递⼀部分参数。因此，可以完全控制函数求值的时间与⽅式。
2、部分应⽤将函数的参数与⼀些预设值绑定（赋值），从⽽产⽣⼀个拥有更少参数的新函数。该函数的闭包中包含了这些已赋值的参数，在之后的调⽤中被完全求值。


### 延迟函数绑定
当期望目标函数使用某个所属对象来执行时，使用函数绑定来设置上下文对象就变得尤为重要。例如，浏览器中的setTimeout和setInterval等函数，如果不将this的引用设为全局上下文，即window对象，是不能正常工作的。
```javascript
function delayFunctionBinding(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}

var obj = {
  name: 'John',
  greet: function() {
    console.log('Hello, ' + this.name + '!');
  }
};

var greet = obj.greet;
greet(); // 输出：Hello, undefined!

var boundGreet = delayFunctionBinding(obj.greet, obj);
boundGreet(); // 输出：Hello, John!
```
在这个例子中，使用 delayFunctionBinding() 函数来创建一个新的函数 boundGreet，该函数在被调用时会将闭包中保存的 this 关键字绑定到 obj 对象上。这样，就可以正确地输出 Hello, John!。

## 组合函数管道
可以将任务分解为多个简单的函数，再通过组合来获得整个解决方案。
函数组合是一种将多个函数合并成一个函数的技术，其中每个函数的输出都作为下一个函数的输入，从而形成一个管道。
可以使用 compose 函数来实现函数组合。compose 函数可以接受任意数量的函数作为参数，并返回一个新函数，该函数将这些函数组合起来形成一个管道。
下面是一个使用 compose 函数实现级联算法的示例代码：
```javascript
const add = x => y => y + x; 
const multiply = x => y => y * x; 
const subtract = x => y =>y - x; 
const divide = x => y => y / x; 
const cascade = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x); 
const result = cascade( add(10), multiply(2), subtract(5), divide(3) )(3); 
console.log(result); // 输出 7
// 在这个示例代码中，我们首先定义了四个基本算术函数：add、multiply、subtract 和 divide。每个函数都接受一个参数，
//并返回一个新的函数，该函数将该参数与下一个参数组合起来进行计算。
// 然后，我们定义了一个名为 cascade 的函数，该函数接受任意数量的函数作为参数，并返回一个新函数，
//该函数将这些函数组合成一个管道。在管道中，每个函数的输出都作为下一个函数的输入。
// 最后，我们使用 cascade 函数将这些基本算术函数组合成一个级联算法，并将输入值设置为 3。运行结果为 7，
//因为管道中的函数先将输入值加上 10，然后将结果乘以 2，再减去 5，最后将结果除以 3。最终结果为 7。
```
### HTML部件的组合
组合的概念是很直观的，也不是函数式编程所独有的。看看HTML ⻚⾯中的部件是如何组织的。复杂的部件都是由简单的部件组合⽽来，⽽反过来⼜可以⽤于构建更⼤的部件。
例如，将3个输⼊⽂本组件与⼀个空容器组合起来可以得到⼀个简单的学⽣表单:
![将3个简单的⽂本组件与⼀个空容器组合以创建⼀个简历表单组件](../img/function4-fn5.png)
现在，学⽣表单也成为⼀个组件，可以与其他组件组合成更复杂的结构，从⽽⼀步步创建出⼀个完整的学⽣控制台表单:
![由地址表单、简历表单、按钮和⼀个容器等⼩部件组合的学⽣控制台表单](../img/function4-fn6.png)

为了演⽰，下⾯创建⼀个叫作Node 的递归结构的元组：
```javascript
const Node = Tuple(Object, Tuple);
```
它可⽤于保存⼀个对象以及对另⼀个节点（元组）的引⽤。本质上，这是⼀个元素列表的函数式定义：由头部和尾部递归组合⽽成。
通过柯⾥化的element 函数
```javascript
const element = R.curry(function(val, tuple) {
 return new Node(val, tuple);
});

```
读者可以创建以null 终⽌的任⼀类型的列表。
![由头部和尾部构成的数字列表。函数式语⾔中的数组已经具有head和tail两个函数](../img/function4-fn7.png)

### 函数组合：描述与求值分离
从本质上讲，函数组合是⼀种将已被分解的简单任务组织成复杂⾏为的整体过程。
```javascript
const str = `We can only see a short distance ahead but we can see plenty there that needs to be done`;
const explode = (str) => str.split(/\s+/); // 将句⼦分割成单词数组
const count = (arr) => arr.length; //单词数量
const countWords = R.compose(count, explode);
countWords(str); //-> 19
```
可以说，这段代码很容易阅读，从函数的组成部分⼀眼就能看出其⾏为。这段程序最有趣的是，直到countWords 被调⽤才会触发求值。换句话说，⽤其名称传递的函数（explode 和count ）在组合中是静⽌的。组合的结果是⼀个等待指定参数调⽤的另⼀个函数countWords 。这是函数式组合的强⼤之处：将函数的描述与求值分开。

### 函数式库的组合
使⽤诸如Ramda这种函数式库的好处之⼀是，所有的函数已经被正确地柯⾥化，在组合函数管道时更具有通⽤性。
R.zip ——通过配对两个数组的内容来创建⼀个新数组。
R.prop ——指定在排序中要使⽤的值。本例中，以 1 作为参数指明使⽤⼦数组的第⼆个元素（成绩）。
R.sortBy ——通过给定的属性执⾏数组的⾃然升序排序。
R.reverse ——反转整个数组以获得第⼀个元素的最⾼数字。
R.pluck ——通过抽取指定索引处的元素构建数组。传递参数 0表⽰提取元素为学⽣姓名。
R.head ——获取第⼀个元素。

再来看⼀个例⼦，以下是⼀个班中各学⽣的名单和成绩获取最聪明的学⽣：
```javascript
const students = ['Rosser', 'Turing', 'Kleene', 'Church'];
const grades = [80, 100, 90, 99];
const smartestStudent = R.compose(
 R.head,
 R.pluck(0),
 R.reverse,
 R.sortBy(R.prop(1)),
 R.zip); //⽤ Ramda 的⼀系列函数组合成新函数smartestStudent
smartestStudent(students, grades); //-> 'Turing' <--- 传给第⼀个函数
R.zip()//两个数组。每⼀步对数据进⾏不可变的变换，直到最后⼀个函数 R.head()，返回结果

```
### point-free编程
Point-free编程是一种编程风格，其中函数不显式地引用它们的参数。相反，它们使用函数组合和柯里化等技术来构建更高级别的函数。这种风格的主要优点是可读性更好，因为它可以消除冗长的参数列表和重复的代码。它还可以促进代码的重用和模块化，因为它鼓励将函数分解为更小的、可组合的部分。Point-free编程通常与函数式编程语言和库一起使用，例如Haskell和Ramda。
```javascript
const toUpperCase = str => str.toUpperCase();
```
我们可以使用Point-free编程的方式来重写这个函数，如下所示：
```javascript
const toUpperCase = String.prototype.toUpperCase.call.bind(String.prototype.toUpperCase);
```
这个函数使用了函数组合的方式，将toUpperCase()方法绑定到了call()方法上，从而实现了将字符串转换为大写的功能，而不需要使用变量。

point-free代码可能会对错误处理和调试造成影响。⽐如，在有异常抛出并产⽣副作⽤时，是否应该在组合函数中返回null来解决呢？尽管可以在函数中检查null ，但会导致很多的代码重复、样板代码以及为了程序进⾏⽽返回的合理默认值。同时，该怎样尝试调试出现在⼀⾏的所有命令呢？这些都需要关注的问题会在下⼀章中予以解决。

## 使⽤函数组合⼦来管理程序的控制流
命令式代码能够使⽤如if-else 和for 这样的过程控制机制，函数式则不能。所以，这需要⼀个替代⽅案——可以使⽤函数组合⼦。
组合器是⼀些可以组合其他函数（或其他组合⼦），并作为控制逻辑运⾏的⾼阶函数。组合⼦通常不声明任何变量，也不包含任何业务逻辑，它们旨在管理函数式程序的流程。除了compose 和pipe ，还有⽆数的组合⼦，⼀些最常⻅的组合⼦如下。
identity 组合子是返回与参数同值的函数，广泛使用于函数数学特性的检验。可以使用identity函数来编写compose的单元测试。
tap（K-组合⼦）它能够将无返回值的函数（例如记录日志、修改文件或HTML页面的函数）嵌入函数组合中，而无须创建其他的代码。它会将所属对象传入函数参数并返回该对象。

alt（OR-组合⼦）能够在提供函数响应的默认行为时执行简单的条件逻辑。该组合器以两个函数为参数，如果第一个函数返回值已定义（即，不是false、null或undefined），则返回该值；否则，返回第二个函数的结果。
该组合⼦的实现如下：
```javascript
const alt = function (func1, func2) {
 return function (val) {
  return func1(val) || func2(val);
 }
};
```
也可以使⽤curry 和lambda表达式写得更简洁：
```javascript
const alt = R.curry((func1, func2, val) => func1(val) ||func2(val));
```
可以将该组合⼦⽤在showStudent 程序中，来处理当获取操作不成功的情况，从⽽创建⼀个新的学⽣：
```javascript
const showStudent = R.compose( append('#student-info'), csv, alt(findStudent, createNewStudent));
showStudent('444-44-4444');

```
若要了解发⽣了什么，可以假设该代码模拟了⼀个简单的ifelse{/0 } 语句，等同于以下的命令式条件逻辑：
```javascript
var student = findStudent('444-44-4444');
if(student !== null) {
 let info = csv(student);
 append('#student-info', info);
}
else {
 let newStudent = createNewStudent('444-44-4444');
 let info = csv(newStudent);
 append('#student-info', info);
}

```
seq（S-组合⼦）用于遍历函数序列。它以两个或更多的函数作为参数并返回一个新的函数，会用相同的值顺序调用所有这些函数。
该组合⼦的实现如下：
```javascript
const seq = function(/*funcs*/) {
 const funcs = Array.prototype.slice.call(arguments);
 return function (val) {
  funcs.forEach(function (fn) {
    fn(val);
  });
 };
};
```
有了它，就可以序列化地执⾏相关但独⽴的多个操作。例如，在找到学⽣对象后，可以使⽤seq 将它们呈现在HTML⻚⾯上并将其输出到控制台。所有函数都以同⼀学⽣对象作为参数顺序执⾏：
```javascript
const showStudent = R.compose( seq( append('#student-info'), consoleLog), csv, findStudent));

```
seq 组合⼦不会返回任何值，只会⼀个⼀个地执⾏⼀系列操作。如果要将其嵌⼊函数组合之间，可以使⽤R.tap 将它与其余部分进⾏桥接。

fork (join)组合子用于需要以两种不同的方式处理单个资源的情况。该组合子需要以3个函数作为参数，即以一个join函数和两个fork函数来处理提供的输入。
该组合⼦的实现如下：
```javascript
const fork = function(join, func1, func2){
 return function(val) {
  return join(func1(val), func2(val));
 };
};
```
现在来看看该组合⼦的使⽤⽅法。让我们重新通过⼀组数字形式的成绩计算出平均的字⺟形式的成绩。可以使⽤fork 来组织3个计算函数的求值：
```javascript
const computeAverageGrade =
 R.compose(getLetterGrade, fork(R.divide, R.sum, R.length));
computeAverageGrade([99, 80, 89]); //-> 'B'

```
下⾯的例⼦⽤于检查均值和集合的中位数是否相等：

```javascript
const eqMedianAverage = fork(R.equals, R.median, R.mean);
eqMedianAverage([80, 90, 100])); //-> True
eqMedianAverage([81, 90, 100])); //-> False
```
有些⼈将组合视为约束，但看来恰恰相反：组合⼦使代码编写更加灵活，并有利于point-free⻛格编程。因为组合⼦都是纯函数，它们也能够结合其他组合⼦使⽤，为任何类型的应⽤程序提供⽆数的替代⽅案并减少复杂度。我们会在后续章节中再次使⽤它们。

## 总结
+ ⽤于连接可重⽤的、模块化的、组件化程序的函数链与管道。
+ Ramda.js是⼀个功能强⼤的函数库，适⽤于函数的柯⾥化与组合。
+ 可以通过部分求值和柯⾥化来减少函数元数，利⽤对参数⼦集的部分求值将函数转化为⼀元函数。
+ 可以将任务分解为多个简单的函数，再通过组合来获得整个解决⽅案。
+ 以point-free的⻛格编写，并⽤函数组合⼦来组织的程序控制流，可解决现实问题。


