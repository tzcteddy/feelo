---
title: 《JavaScript函数式编程指南》第二章 ⾼阶JavaScript
date: 2023-11-19 12:00:00
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---

# 第二章 ⾼阶JavaScript

## 函数式与面向对象(OOP)
> 面向对象的JavaScript
> 当说到⼀个对象与另⼀个对象之间具有⼦类型或派⽣类型的关系时， 指的是它们之间存在的原型关系。有必要指出，尽管 JavaScript 是⾯向对 象的，但其并不具备像 Java 这样的语⾔中典型的继承关系。
> 在ES6中，可以通过使⽤像关键字class 和extends 这样的语法糖 来建⽴对象之间的原型链接（尽管很多情况下这样做是不对的）。这样的 特性使得定义对象之间的继承更加简单，但却隐藏了 JavaScript 强⼤的原 型机制的真实⾏为。

⾯向对象的应⽤程序⼤多是命令式的，因此在很⼤程度上依赖于使⽤基于对象的封装来保护其⾃⾝和继承的可变状态的完整性，再通过实例⽅法来暴露或修改这些状态。其结果是，对象的数据与其具体的⾏为以⼀种内聚的包裹的形式紧耦合在⼀起。⽽这就是⾯向对象程序的⽬的，也正解释了为什么对象是抽象的核⼼。

再看函数式编程，它不需要对调⽤者隐藏数据，通常使⽤⼀些更 ⼩且⾮常简单的数据类型。由于⼀切都是不可变的，对象都是可以直接拿来使⽤的，⽽且是通过定义在对象作⽤域外的函数来实现的。换句话说，数据与⾏为是松耦合的。

![⾯向对象的程序设计通过特定的⾏为将很多数据类型逻辑地连接在⼀起，函数式编程 则关注如何在这些数据类型之上通过组合来连接各种操作。因此存在⼀个两种编程范式都可 以被有效利⽤的平衡点。](../img/function2-oop1.png)

在实践中，⼀些极好的⾯向对象代码均使⽤了两种编程范式——正是在这个相交的平衡点上。要做到这⼀点，你需要把对象视为不可变的实 体或值，并将它们的功能拆分成可应⽤在该对象上的函数。


```js
   get fullname() {
      // ⽐如在 ⽅法中，会推荐使⽤this来访问对象的状态
      return [this._firstname, this._lastname].join(' '); 
   }

  // 拆分出如下的函数 函数中this可以替换为传⼊的参数对象
   var fullname = person => [person.firstname, person.lastname].join(' ');
```

![⾯向对象的关键是创建继承层次结构（如继承Person 的Student 对象）并将⽅法与 数据紧密的绑定在⼀起。函数式编程则更倾向于通过⼴义的多态函数交叉应⽤于不同的数据 类型，同时避免使⽤this](../img/function2-oop2.png)

将fullname()分离⾄独⽴的函数，可以避免使⽤ this 引⽤来访问对象数据。使⽤this的缺点是它给予了超出⽅法作⽤域的实例层级的数据访问能⼒，从⽽可能导致副作⽤。```使⽤函数式编程，对象数据不再与代码的特定部分紧密耦合，从⽽更具重⽤性和可维护性```。

对象类中的peopleInSameCountry和studentsInSameCountryAndSchool，使⽤this和super 将各种操作与当前对象以及⽗对象紧紧地耦合在⼀起。

[代码在线演示](https://code.juejin.cn/pen/7303183148479676470)
```js
/**
 * 任务1: 是找到与给定的学⽣⽣活在同⼀国家的所有朋友
 * 任务2: 找到与给定的学⽣⽣活在同⼀个国家且在同⼀所学校上学的所有学⽣
 */

/**
 * 任务1: 是找到与给定的学⽣⽣活在同⼀国家的所有朋友
 * 任务2: 找到与给定的学⽣⽣活在同⼀个国家且在同⼀所学校上学的所有学⽣
 */

class Address {
  constructor(country, state, city, zip, street) {
    this._country = country;
    this._state = state;
    this._city = city;
    this._zip = zip;
    this._street = street;
  }
  get street() {
    return this._street;
  }
  get city() {
    return this._city;
  }
  get state() {
    return this._state;
  }
  get zip() {
    return this._zip;
  }
  get country() {
    return this._country;
  }
}

class Person {
  constructor(firstname, lastname, ssn) {
    this._firstname = firstname;
    this._lastname = lastname;
    this._ssn = ssn;
    this._address = null;
    this._birthYear = null;
  }
  get ssn() {
    return this._ssn;
  }
  get firstname() {
    return this._firstname;
  }
  get lastname() {
    return this._lastname;
  }
  get address() {
    return this._address;
  }
  get birthYear() {
    return this._birthYear;
  }
  //使⽤setter⽅法并不代表要改变对象，⽽只是创 建含有不同属性的对象，⽽且⽆需⻓参数构造函数的⽅式。在创建并设置好对象后，它们 的状态将不会改变（本章之后的部分会解释处理⽅式）
  set birthYear(year) {
    this._birthYear = year;
  }
  // 使⽤setter⽅法并不代表要改变对象，⽽只是创建含 有不同属性的对象，⽽且⽆需⻓参数构造函数的⽅式。在创建并设置好对象后，它们的状态将不会改变（本章后的部分会解释处理⽅式）
  set address(addr) {
    this._address = addr;
  }
  toString() {
    return `Person(${this._firstname}, ${this._lastname})`;
  }
  // Person class
  peopleInSameCountry(friends) {
    var result = [];
    for (let idx in friends) {
      var friend = friends[idx];
      if (this.address.country === friend.address.country) {
        result.push(friend);
      }
    }
    return result;
  };
}


class Student extends Person {
  constructor(firstname, lastname, ssn, school) {
    super(firstname, lastname, ssn);
    this._school = school;
  }
  get school() {
    return this._school;
  }
  // Student class
  // 使⽤super调⽤⽗类的数据
  studentsInSameCountryAndSchool(friends) {
    var closeFriends = super.peopleInSameCountry(friends);
    var result = [];
    for (let idx in closeFriends) {
      var friend = closeFriends[idx];
      if (friend.school === this.school) {
        result.push(friend);
      }
    }
    return result;
  };
}


var curry = new Student('Haskell', 'Curry',
 '111-11-1111', 'Penn State');
curry.address = new Address('US');
var turing = new Student('Alan', 'Turing','222-22-2222', 'Princeton');
turing.address = new Address('England');
var church = new Student('Alonzo', 'Church',
 '333-33-3333', 'Princeton');
church.address = new Address('US');
var kleene = new Student('Stephen', 'Kleene',
 '444-44-4444', 'Princeton');
kleene.address = new Address('US');

// Stephen-Kleene
console.log(church.studentsInSameCountryAndSchool([curry, turing, kleene]).map(t => `${t.firstname}-${t.lastname}`))


// 创建selector函数，⽤来⽐较学⽣的国籍与学校
function selector(country, school) {
  return function (student) {
    //访问对象。 我会在本章后⾯的部分展⽰访问对象的更好⽅式
    return student.address.country === country && student.school === school;
  };
}
// 使⽤filter⽤selector过滤数组
var findStudentsBy = function (friends, selector) {
  return friends.filter(selector);
};

// Alonzo-Church,Stephen-Kleene
console.log(findStudentsBy([curry, turing, church, kleene], selector('US', 'Princeton')).map(t => `${t.firstname}-${t.lastname}`));


```
⾯向对象和函数式编程⼀些重要性质的⽐较如下：
|  | 函数式 | ⾯向对象  |
| --- | --- | --- |
| 组合单元 | 函数 | 对象（类） |
| 编程⻛格 | 声明式 | 命令式  |
| 数据和⾏为 | 独⽴且松耦合的纯函数 | 与⽅法紧耦合的类 |
| 状态管理 | 将对象视为不可变的值 | 主张通过实例⽅法改变对象 |
| 程序流控制 | 函数与递归 | 循环与条件 |
| 线程安全 | 可并发编程 | 难以实现 |
| 封装性 | 因为⼀切都是不可变的，所以没有必要 | 因为⼀切都是不可变的 |

尽管它们之间存在差异，但有效构建应⽤程序的⽅法是混合两种 范式。⼀⽅⾯，可以使⽤与组成类型之间存在⾃然关系的富领域模型；另⼀⽅⾯，可以拥有⼀组能够应⽤于这些类型之上的纯函数。

由于JavaScript 既是⾯向对象的，⼜是函数式的，因此在编写函数式代码时，需要特别注意控制状态的变化。

### 管理JavaScript对象的状态
程序的状态可以定义为在任⼀时刻存储在所有对象之中的数据快照。

可惜的是，JavaScript 是在对象状态安全⽅⾯做得最差的语⾔之 ⼀。JavaScript 的对象是⾼度动态的，其属性可以在任何时间被修改、 增加或删除。

### 将对象视为数值

#### 函数式编程中的数值

字符串和数字 - 是任何编程语⾔中最简单的数据类型 这样认为 WHY?
部分原因在于，在传统意义上，这些原始类型本 ⾝就是不可变的，⽽这给我们的内⼼带来了其他⾃定义类型所⽆法给予的平和。
在函数式编程中，我们将具有此种⾏为的类型称为数值。

#### JavaScript的对象也只是可在任意时间添加、删除和更改的属性包⽽已。如何解决？

ES6的const关键字并不能达到函数式编程所需要的不可变性的⽀持⽔平
```js
  const gravity_ms = 9.806;
  gravity_ms = 20; // JavaScript会在运⾏时阻⽌再赋值


  const student = new Student('Alonzo', 'Church', '666-66-6666', 'Princeton');
  student.lastname = 'Mourning'; // 属性已经变了
```

在 JavaScript 中，可以使⽤函数来保障 ZIP code 的内部状态访问 权限，通过返回⼀个对象字⾯接⼝ 来公开⼀⼩部分⽅法给调⽤者，这样就可以将_code 和_location 视为伪私有变量。

```js
function zipCode(code, location) {
 let _code = code;
 let _location = location || '';
 return {
  code: function () {
    return _code;
  },
  location: function () {
    return _location;
  },
  fromString: function (str) {
    let parts = str.split('-');
    return zipCode(parts[0], parts[1]);
  },
  toString: function () {
    return _code + '-' + _location;
  }
 };
}
const princetonZip = zipCode('08544', '3345');
princetonZip.toString(); //'08544-3345'
```

值对象是⼀种可简单应⽤于⾯向对象和函数式编程的轻量级⽅式。与关键字const组合在⼀起使⽤，我们就可以创建具有与字符串或数字类似语义的对象。
```js
function coordinate(lat, long) {
  let _lat = lat;
  let _long = long;
  return {
    latitude: function () {
      return _lat;
    },
    longitude: function () {
      return _long;
    },
    // 让⽅法返回⼀个新的副本（例如 translate ）是另⼀种实现不s可变性的⽅式。
    translate: function (dx, dy) {
      return coordinate(_lat + dx, _long + dy); // 返回翻译过的 坐标副本
    },
    toString: function () {
      return '(' + _lat + ',' + _long + ')';
    }
 };
}
const greenwich = coordinate(51.4778, 0.0015);
greenwich.toString(); // '(51.4778, 0.0015)'
```

值对象是⼀个由函数式编程启发⽽来的⾯向对象设计模式。

### 深冻结可变部分
JavaScript 的Object.freeze()函数可以通过writable隐藏对象元属性设置为false来阻⽌对象状态的改变。

```js
var person = Object.freeze(new Person('Haskell', 'Curry', '444-44-4444'));
person.firstname = 'Bob'; // 不被允许 TypeError: Cannot assign to read only property '_firstname' of #<Person>
```

Object.freeze()不能被⽤于冻结嵌套对象属性.

![只有顶层变量会被冻结，该Object.freeze机制是浅冻结](../img/function2-oop3.png)

要解决浅冻结问题，需要⼿动冻结对象的嵌套结构.
```js
var isObject = (val) => val && typeof val === 'object';
function deepFreeze(obj) {
    // 遍历所有属性并递归调⽤Object.freeze()
    if(isObject(obj) && !Object.isFrozen(obj)) { // 跳过已经冻结过的对象，冻结没有被冻 结过的对象
      // 跳过所有的函数，即使从技术上说，函数也可以被修改, 但是我们更希望注意在数据的属性上
      // 递归地⾃调⽤
      Object.keys(obj).forEach(name => deepFreeze(obj[name]));
      // 冻结根对象
      Object.freeze(obj);
 }
  return obj;
}
```

上述的⼀些技巧可以⽤来增强代码中的不可变性⽔平，但要创建 ⼀个永不改变任何状态的应⽤是不现实的。
在由原对象创建新 对象（如coordinate.translate() ）时，使⽤这些严格的策略能 够有效降低JavaScript应⽤的复杂性。

### 使⽤Lenses【透镜】（函数式引⽤）定位并修改对象图
> 是函数式程序设计中⽤于访问和不可改变地操纵状态数据类型属性的解决⽅案

```js
  // ⾃⾏实现写时复制策略，在每次⽅法调⽤时返回⼀个新的对象。 烦琐且容易出错
  set lastname(lastname) {
    return new Person(this._firstname, lastname, this._ssn); // 需要将对象中所有的属性状态复制到新的实例（太糟糕了）
  };
```

[ramdajs库文档地址](https://ramdajs.com/docs/)
```js
  const R = require('ramda');

  // 使⽤ R.lensProp 来创建⼀个包装了Person 的 lastname属性的 Lens
  var person = new Person('Alonzo', 'Church', '444-44-4444');
  var lastnameLens = R.lenseProp('lastName');

  // 使⽤R.view 来读取该属性的内容
  R.view(lastnameLens, person); //-> 'Church'

  // 调⽤R.set 时，它创建并返回⼀个全新的对象 副本，其中包含⼀个新的属性值，并保留原始实例状态
  var newPerson = R.set(lastnameLens, 'Mourning', person);
  newPerson.lastname; //-> 'Mourning'
  person.lastname; //-> 'Church'

  // 支持嵌套
  person.address = new Address('US', 'NJ', 'Princeton', zipCode('08544','1234'), 'Alexander St.');
  var zipPath = ['address', 'zip'];
  var zipLens = R.lens(R.path(zipPath), R.assocPath(zipPath));
  R.view(zipLens, person); //-> zipCode('08544', '1234')


  var newPerson = R.set(zipLens, person, zipCode('90210', '5678'));
  R.view(zipLens, newPerson); //-> zipCode('90210', '5678')
  R.view(zipLens, person); //-> zipCode('08544', '1234')
  newPerson !== person; //-> true
```

## 函数
函数是函数式编程的⼯作单元与中⼼。
为了达到学习⽬的，我们需要区分表达式（如返回⼀个值的函数）和语句（如不返回值的函数）。
命令式编程和过程式程序⼤多是由⼀系列有序的语 句组成的，⽽函数式编程完全依赖于表达式，因此⽆值函数在该范式下并没有意义。

JavaScript 函数有两个⽀柱性的重要特性：⼀等的和⾼阶的。

### ⼀等函数
在JavaScript中，术语是⼀等的，指的在语⾔层⾯将函数视为真实的对象。

> 一等公民的定义
> 根据维基百科，编程语言中一等公民的概念是由英国计算机学家Christopher Strachey提出来的，时间则早在上个世纪 60 年代，那个时候还没有个人电脑，没有互联网，没有浏览器，也没有 JavaScript。


> 来自于一本书《Programming Language Pragmatics》，这本书是很多大学的程序语言设计的教材。
> In general, a value in a programming language is said to have ﬁrst-class status if it can be passed as a parameter, returned from a subroutine, or assigned into a variable.
> 也就是说，在编程语言中，一等公民可以作为函数参数，可以作为函数返回值，也可以赋值给变量。

> 一篇讲JavaScript历史的文章里面提到：JavaScript借鉴Scheme语言，将函数提升到”一等公民”（first class citizen）的地位。


```js
  // 函数声明
  function multiplier(a,b) {
    return a * b;
  }

  // 作为匿名函数或lambda表达式给变量赋值
  var square = function (x) { // 匿名函数
    return x * x;
  }

  var square = x => x * x; // lambda表达式

  // 作为成员⽅法给对象的属性赋值
  var obj = {
    method: function (x) { return x * x; }
  };
```

函数还可以通过构造函数来实例化，构造函数以函数形参，函数体为参 数，并需要使⽤new 关键字，如：

```js
  var multiplier = new Function('a', 'b', 'return a * b');
  multiplier(2, 3); //-> 6
```

在 JavaScript 中，任何函数都是 Function 类型的⼀个实例
函数的 length 属性可以⽤来获取形参的数量
apply()和call()⽅法可以⽤来调⽤函数并加⼊上下⽂

### ⾼阶函数

匿名函数表达式的右侧是⼀个具有空 name 属性的函数对象。可 以通过将匿名函数作为参数的⽅式来扩展或者定制化当前函数的⾏ 为。
```js
  people.sort((p1, p2) => p1.getAge() - p2.getAge());
```
像sort() 这样可以接收其他函数作为参数的JavaScript函数，均属于⼀种函数类型——⾼阶函数。

```js
function applyOperation(a, b, opt) { // opt()函数可以作为参数传⼊其他函数中
 return opt(a,b);
}
var multiplier = (a, b) => a * b;
applyOperation(2, 3, multiplier); // -> 6
```

```js
function add(a) {
 return function (b) { // ⼀个返回其他函数的函数
    return a + b;
 }
}
add(3)(3); //-> 6
```

因为函数的⼀等性和⾼阶性，JavaScript函数具有值的⾏为。 ```函数就是⼀个基于输⼊的且尚未求值的不可变的值。```

通过组合⼀些⼩的⾼阶函数来创建有意义的表达式，可以简化很多烦琐的程序。

```js
// 要打印住在美国的⼈员名单
function printPeopleInTheUs(people) {
  for (let i = 0; i < people.length; i++) {
    var thisPerson = people[i];
    if(thisPerson.address.country === 'US') {
      console.log(thisPerson); // <---隐式调⽤对象的toString⽅法
    }
  }
}
printPeopleInTheUs([p1, p2, p3]); // <--- p1、p2和p3 是Person的实例

// ⽀持打印⽣活在其他国家的⼈
function printPeople(people, action) {
  for (let i = 0; i < people.length; i++) {
    action (people[i]);
  }
}
var action = function (person) {
  if(person.address.country === 'US') {
    console.log(person);
  }
}
printPeople(people,action); 

// 基于函数的⾼阶特性将printPeople重构 数据 + 条件 + 动作分离
function printPeople(people, selector, printer) {
 people.forEach(function (person) {
  if(selector(person)) {
    printer(person);
  }
 });
}
var inUs = person => person.address.country === 'US';
printPeople(people, inUs, console.log);

// 以使⽤ Lens 来创建可以访问对象属性的函数 -- 代码⽐之前的更加函数式
var countryPath = ['address', 'country'];
var countryL = R.lens(R.path(countryPath), R.assocPath(countryPath));
var inCountry = R.curry((country, person) => R.equals(R.view(countryL, person), country));
people.filter(inCountry('US')).map(console.log); 
```
### 函数调⽤的类型
JavaScript 给予了我们完全的⾃由来指定调⽤函数的运⾏上下⽂，也就是函数体中 this 的值。
不同的⽅式来调⽤： 
+ 作为全局函数 -- 其中this 的引⽤可以是global 对象或是undefined （在严格模式中）
```js
function doWork() {
 this.myVar = 'Some value'; // 在全局上下⽂调⽤doWork()会造成this引⽤到全局对象上
}
doWork(); // 在全局上下⽂调⽤doWork()会造成this引⽤到全局对象上
```
+ 作为⽅法 -- 其中 this 的引⽤是⽅法的所有者 OOP
```js
  var obj = {
    prop: 'Some property', 
    getProp: function () {return this.prop} // 调⽤对象中的⽅法时，this指向该对象
  };
  obj.getProp(); // 调⽤对象中的⽅法时，this指向该对象
```
+ 作为构造函数与 new⼀起使⽤ -- 这种⽅式会返回新创建对象的引⽤
```js
  function MyType(arg) {
    this.prop = arg; // 使⽤new关键字会把this引⽤到新创建的对象上 
  }
  var someVal = new MyType('some argument'); // 使⽤new关键字会把this引⽤到新创建的对象上
```

在函数式代码中很少会使⽤this（事实上，应不 惜⼀切代价来避免使⽤它）。但在⼀些库和⼯具中，它被⼤量使⽤， 以在⼀些特殊情形下改变语⾔环境来实现⼀些难以置信的功能。这些 往往会涉及 apply ⽅法以及 call ⽅法。

### 函数⽅法
JavaScript ⽀持通过使⽤函数原型链上的函数⽅法（类似元函数）call 和 apply 来调⽤函数本⾝。

## 作用域与闭包

### 作用域分类
+ 全局作⽤域
  任何对象和在脚本最外层声明的（不在任何函数中的）变量都是全局作⽤域的⼀部分，并且可以被所有JavaScript代码访问。
  在函数式编程时，我们应该不惜⼀切代价地避免使⽤全局变量。
+ 函数作⽤域
  
  ```js
    var x = 'Some value';
    function parentFunction() {
      function innerFunction() {
        console.log(x);
      }
      return innerFunction;
    }
    var inner = parentFunction();
    inner();
  ```

![JavaScript 的名称解析顺序，在最近的作⽤域查找到变量，并逐层向外扩展。 它⾸先检查函数（局部）作⽤域，然后移动到（倘若存在的）⽗作⽤域，最终移动⾄ 全局作⽤域。如果⽆法找到变量x ，该函数将返回 undefined](../img/function2-fn2.png)
  
+ 伪块作⽤域
  标准 ES5 JavaScript 并不⽀持块级作⽤域。
    - 比如包裹在括号{} 中的，⾪属于各种控制结构，如 for 、while 、if 和switch 语句。
    - 传递到 catch 块的错误变量 - 块级作用域
    - 语句 with 与块作⽤域类似，但它已不被建议使⽤，并且在严格模式下被 禁⽌。
  ```js
    function doWork() {
      if (!myVar) {
        var myVar = 10;
      }
      console.log(myVar); //-> 10
    }
    doWork();
  ```
  ```js
  var arr = [1, 2, 3, 4];
  function processArr() {
    function multipleBy10(val) {
      i = 10;
      return val * i;
    }
    for(var i = 0; i < arr.length; i++) {
      arr[i] = multipleBy10(arr[i]);
    }
    return arr;
  }
  processArr(); //-> [10, 2, 3, 4]
  ```
  
  推荐ES6使⽤let ⽽不是var 来声明作⽤域变量

### 闭包
```js
  var outerVar = 'Outer'; <---声明全局变量outerVar
  function makeInner(params) {
    var innerVar = 'Inner'; // 调⽤makeInner会得到inner函数
    function inner() {
      // 声明inner：innerVar和outerVar在inner闭包内
      console.log(`I can see: ${outerVar}, ${innerVar}, and ${params}`);
    }
   return inner;
  }
  var inner = makeInner('Params'); // 声明局部变量makeInner
  inner(); // 函数inner⽣命周期⽐外部函数还⻓

  // --> 'I can see: Outer, Inner, and Params'
```

![作用域示意](../img/function2-fn1.png)

###### 闭包包含了在外部（全局）作⽤域中声明的变量、在⽗函数内部作⽤域中声明的变量、⽗函数的参数以及在函数声明之后声明的变量。函数体中的代码可以访问这些作⽤域中 定义的变量和对象。⽽所有函数都共享全局作⽤域

从makeInner 返回的函数会在其声明时记住其作⽤域内的所有变量， 并防⽌它们被回收。由于全局作⽤域内也是闭包的⼀部分，因此返回 的函数也能够访问 outerVar 。

闭包是⼀种能够在函数声明过程中将环境信息与所属函数绑定在⼀起的数据结构。它是基于函数声明的⽂本位置的，因此也被称为围 绕函数定义的静态作⽤域或词法作⽤域。
⽀配函数闭包⾏为的规则与 JavaScript 的作⽤域规则密切相关。
从本质上讲，闭包就是函数继承⽽来的作⽤域，这类似于对象⽅法是如何访问 其继承的实例变量的，它们都具有其⽗类型的引⽤。

#### 闭包的实际应⽤
+ 模拟私有变量
  ```js
  var MyModule = (function MyModule(export) { // <---给IIFE⼀个名字，这样 有⽤的信息更⽅便栈追踪
    let _myPrivateVar = ...;  // <---⽆法从外部访问到这个私有变量，但对内部 的两个⽅法可⻅
        export.method1 = function () {  //<---需要暴露的⽅法，这⾥给予了伪命名空 间// do work
    };
    export.method2 = function () { //<---需要暴露的⽅法，这⾥给予了伪命名 空间
    // do work
    };
  }(MyModule || {})); // <---⼀个单例对象，⽤来私有的封装所有的状态和⽅法。可以 通过MyModule.method1()调⽤到method1()
  ```
  闭包还可以⽤来管理的全局命名空间，以免在全局范围内共享数 据。⼀些库和模块还会使⽤闭包来隐藏整个模块的私有⽅法和数据。 这被称为模块模式 ，它采⽤了⽴即调⽤函数表达式（IIFE） ，在封 装内部变量的同时，允许对外公开必要的功能集合，从⽽有效减少了全局引⽤。
+ 异步服务端调⽤
  ```js
    getJSON('/students',(students) => {
      getJSON('/students/grades', 
        grades => processGrades(grades), // 处理两个返回结果
        error => console.log(error.message)); // 处理获取评分等级 时发⽣的错误
    },
    // 处理获取学⽣时发⽣的错误
    (error) => console.log(error.message) )
  ```
+ 模拟块作⽤域变量
  ```js
  function outputNumbers(count){
    (function(){
      //块级作用域
      for(var i = 0; i < count; i++){
        console.log(i); // 0, 1, ... count - 1
      }
    })();
    console.log(i); // error
  }
  ```

## 总结
+ JavaScript 是⼀种⽤途⼴泛的、具有强⼤⾯向对象和函数式编程特性的语⾔。 
+ 使⽤不可变的实现⽅式可以使函数式与⾯向对象编程很好地结合在⼀起。
+ ⼀等⾼阶的函数使得 JavaScript 成了函数式编程的中坚⼒量。
+ 闭包具有很多实际⽤途，如信息隐藏、模块化开发，并能够将参数化的⾏为跨数据类型地应⽤于粗粒度的函数之上。

## 附件
![总结脑图](../img/mind/function2.png)
