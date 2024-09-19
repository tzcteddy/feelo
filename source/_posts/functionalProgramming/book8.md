---
title: 《JavaScript函数式编程指南》第八章 走管理异步事件以及数据
date: 2024-01-14 21:07:59
post: comments
enable: true
categories: 
- 函数式编程指南
tags: 
- 读书分享
---

# 第八章 管理异步事件以及数据

## 异步代码的挑战

### 函数之间创建时间依赖关系
当某些函数的执行在逻辑上分组在一起时，会发生时间耦合或时间内聚。这意味着函数需要等待数据可用或需要等待其他函数运行结束才能完成操作。无论是依赖于数据还是时间，这样做都会产生副作用。

```js
var student = null 
getJSON('/students', function(studentObjs) {
  student = studentObjs
},
function (errorObj) {
  console.log(errorObj.msg)
})
showStudents(student)
```

### 回调地狱 

回调地狱，其实简单来说就是异步回调函数的嵌套。

回调的主要用途是避免阻塞UI，防止用户长时间等待IO进程完成。接受回调而不是返回值的函数实现了一种控制反转的形式：“不要打电话给我，我会打给你的”。

```js
getJSON('/students',
     function (students) {  <---第一层嵌套用于包含成功和失败回调的 AJAX 请求
       students.sort(function(a, b){
             if(a.ssn < b.ssn) return -1;
             if(a.ssn > b.ssn) return 1;
             return 0;
       });
       for (let i = 0; i < students.length; i++) {
         let student = students[i];
         if (student.address.country === 'US') {
            getJSON(`/students/${student.ssn}/grades`,
               function (grades) {  <---收到每个学生的成绩后，需要改写该函数来支持在表格中一个一个地增加学生及其成绩信息
                 showStudents(student, average(grades));  <---第二层嵌套用于包含其成功和失败回调的学生成绩获取请求
               },
               function (error) {  <---收到每个学生的成绩后，需要改写该函数来支持在表格中一个一个地增
加学生及其成绩信息
                  console.log(error.message);
               });
         }
       }
     },
     function (error) {
        console.log(error.message);  <---第一层嵌套用于包含成功和失败回调的 AJAX 请求
   }
 );
```
![回调地狱](../img/callback-hell.png)

### 使用持续传递式样

```js
var _selector = document.querySelector;

_selector('#search-button').addEventListener('click', handleMouseMovement);

var processGrades = function (grades) {
    // ... process list of grades for this student...
};

var handleMouseMovement = () =>
    getJSON(`/students/${info.ssn}/grades`, processGrades);

var showStudent = function (info) {
   _selector('#student-info').innerHTML = info;
   _selector('#student-info').addEventListener(
      'mouseover', handleMouseMovement);
};

var handleError = error =>
    console.log('Error occurred' + error.message);

var handleClickEvent = function (event) {
    event.preventDefault();

    let ssn = _selector('#student-ssn').value;
    if(!ssn) {
       alert('Valid SSN needed!');
       return;
    }
    else {
       getJSON(`/students/${ssn}`, showStudent).fail(handleError);
    }
```
CPS是一种用于非阻塞程序的编程风格，它鼓励开发者将程序分成单个组件，因此它是函数式编程的中间形式。

```js
for (let i = 0; i < students.length; i++) {
   let student = students[i];
   if (student.address.country === 'US') {
      getJSON(`/students/${student.ssn}/grades`,
         function (grades) {
            showStudents(student, average(grades));
         },
         function (error) {
           console.log(error.message);
         }
      );
   }
}
```


![异步函数与同步循环混合的错误命令式代码的运行结果。在获取远程数据时，函数调用将始终引用最后迭代的（闭包中的）学生记录，无论并打印多少次](../img/csp-res.png) 

## Promise

- 使用组合和point-free编程。
- 将嵌套结构扁平化为更线性的流程。
- 抽象时间耦合的概念，这样就不需要关心它。
- 将错误处理整合到单个函数，而不是多个错误回调遍布在业务代码中。

### 手写简单的Promise 

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECT = 'reject'

class Promise {
  constructor () {
    this.staus = PENDING
    this.value = ''
    this.reason = ''
    this.onResolvedCallBack = []
    this.onRejectedCallBack = []
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED 
        this.value = value
        this.onResolvedCallBack.forEach(fn => fn())
      }
    } 

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECT 
        this.reason = reason
        this.onRejectedCallBack.forEach(fn => fn())
      }
    }

    try {
      exector(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFIllED) {
      onFulfilled(this.value)
    }

    if (this.status === REJECT) {
      onRejected(this.reason)
    }

    if (this.status === PENDING) {
      this.onResolvedCallBack.push(() => onFulfilled(this.value))
      this.onRejectedCallBack.push(() => onRejected(this.reason))
    }
  }
}
```
![promise1](../img/promise-1.png) 

### 链接将来的方法
![promise2](../img/promise-2.png)  

### 组合同步和异步行为
![promise3](../img/promise-3.png) 

## 生成惰性数据 
生成器函数通过语言级别的function* 符号定义（是的，带有星号的函数）。这种新型函数可以使用新的关键字yield退出，随后还可以重新进入该上下文（所有本地变量绑定）。

+ Generator 函数是一个状态机，封装了多个内部状态。
+ Generator 函数返回一个生成器对象，该对象也实现了 Iterator 接口（也可供 for...of 等消费使用），所以具有了 next() 方法。因此，使得生成器对象拥有了开始、暂停和恢复代码执行的能力。
+ 生成器对象可以用于自定义迭代器和实现协程（coroutine）。
+ Generator 函数从字面理解，形式与普通函数很相似。在函数名称前面加一个星号（*），表示它是一个生成器函数。尽管语法上与普通函数相似，但语法行为却完全不同。
+ Generator 函数强大之处，感觉很多人没 GET 到。它可以在不同阶段从外部直接向内部注入不同的值来调整函数的行为。
生成器对象，是由 Generator 函数返回的，并且它返回可迭代协议和迭代器协议，因此生成器对象是一个可迭代对象。

```js
// async/await 自动执行器
function runGenerator(gen) {
  return new Promise((resolve, reject) => {
    let g = gen()
    function _next() {
      let res
      try {
        res = g.next(val)
      } catch(err) {
        return reject(err)
      }
      if (res.done) {
        return resolve(res.value)
      }
      //res.value包装为promise，以兼容yield后面跟基本类型的情况
      Promise.resolve(res.value).then(val => {
        _next(val)
      }, err => {
        g.throw(err)
      })
    }
    _next()
  })
}
```

### 生成器与递归
![tree](../img/tree.png) 
```js
function* TreeTraversal(node) {
    yield node.value;
    if (node.hasChildren()) {
        for(let child of node.children) {
            yield* TreeTraversal(child);  <---使用 yield*将调用请求代理给生成器自身
        }
    }
}

var root = node(new Person('Alonzo', 'Church', '111-11-1231'));  <---第 3 章中提到， 树的根对象由 Church节点开始

for(let person of TreeTraversal(root)) {
   console.log(person.lastname);
}
```
### 迭代器协议
生成器与另一个称为迭代器的ES6特性紧密相连，这也是可以像遍历其他数据结构（如数组）一样遍历生成器的原因。事实上，生成函数返回符合迭代器协议的Generator对象。这意味着它实现一个名为next()的方法，该方法返回使用yield关键字return的值。此对象具有以下属性。

done ——如果迭代器到达序列结尾，则值为true；否则，值为false，表示迭代器还可以生成下一个值。
value  ——迭代器返回的值

```js
function range(start, end) {
  return {
    [Symbol.iterator]() {  <---表明返回的对象是一个（实现了迭代器协议的） iterable 对象
      return this;
    },
    next() {
      if(start < end) {
        return { value: start++, done:false };  <---生成器的主要逻辑实现。如果还有可生成的数据，返回一个包含了生成值和 done标志为 false 的对象；否则，done 会被置为 true
      }
      return { done: true, value:end };  <---生成器的主要逻辑实现。如果还有可生成的数据，返回一个包含了生成值和 done标志为 false 的对象；否则，done 会被置为 true
    }
  };
}
```

## 使用RxJS进行函数式和响应式编程

响应式思维与函数式思维没有什么不同，只是使用不同的工具集而已。实际上，大部分网络上的响应式编程的文档都是通过介绍函数式编程技术开始的。流带来的是声明式的代码和链式计算。因此，响应式编程倾向于和函数式编程一起使用，从而产生函数式响应式编程（Functional Reactive Programming，FRP）

