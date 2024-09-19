---
title: 《Vue.js 设计与实现》第一章 权衡的艺术
date: 2024-03-10 20:00:00
post: comments
enable: true
categories: 
- Vue.js 设计与实现
tags: 
- 读书分享
- vue原理
---

# 第一章 权衡的艺术
> 框架设计里到处都体现了权衡的艺术
设计一个框架的时候，框架本身的各个模块之间并不是相互独立的，而是相互关联、相互制约的。因此作为框架设计者，一定要对框架的定位和方向拥有全局的把控，这样才能做好后续的模块设计和拆分。

## 命令式和声明式

### 命令式 
关注过程
自然语言描述能够与代码产生一一对应的关系，代码本身描述的是“做事的过程”
```js
// jQuery
$('#app') // 获取 div
.text('hello world') // 设置文本内容
.on('click', () => { alert('ok') }) // 绑定点击事件

// js
const div = document.querySelector('#app') // 获取 div
div.innerText = 'hello world' // 设置文本内容
div.addEventListener('click', () => { alert('ok') }) // 绑定点击事 件
```
### 声明式
关注结果
不关注过程，只关心结果，vue的内部实现一定是命令式的，暴漏给用户的是声明式的用法。
```js
// vue
<div @click="() => alert('ok')">hello world</div>
```
## 性能与可维护性的权衡
声明式代码的性能不优于命令式代码的性能


```js
// A
div.textContent = 'hello vue3' // 直接修改
```

```js
// B
// 之前:
<div @click="() => alert('ok')">hello world</div> 
// 之后
<div @click="() => alert('ok')">hello vue3</div>
```
命令式代码的更新性能消耗 = A
声明式代码的更新性能消耗 = B + A

声明式代码可维护性更强，我们只关心最终的结果，具体的实现交给框架来封装

可维护性和性能的权衡
在保持可维护性的同时让性能损失更小化

## 虚拟dom的性能到底如何
虚拟dom的更新技术性能理论上不可能比原生js操作dom更高 
虚拟dom解决的问题是在保证可维护性的情况下，尽可能的保证应用程序性能的下限，并想办法逐渐逼近命令式代码的性能


![创建](../img/vue/vue1/inner1.png)

![更新](../img/vue/vue1/inner2.png)

![更新性能](../img/vue/vue1/inner3.png)

![更新性能比较](../img/vue/vue1/inner4.png)

## 运行时和编译时
纯运行时、运行时+编译时、纯编译时

### 纯运行时的框架
```js 
const obj = {
  tag: 'div',
  children: [
    { tag: 'span', children: 'hello world' }
  ]
}

function Render(obj, root) {
  const el = document.createElement(obj.tag)
  if (typeof obj.children === 'string') {
    const text = document.createTextNode(obj.children)
    el.appendChild(text)
  } 

  } else if (obj.children) {
    // 数组，递归调用 Render，使用 el 作为 root 参数
    obj.children.forEach((child) => Render(child, el))
  }
  // 将元素添加到 root
  root.appendChild(el)
}

// 渲染到 body 下
Render(obj, document.body)
```

### 运行时+编译
```js
const html = `
<div>
 <span>hello world</span>
</div>
 `
// 调用 Compiler 编译得到树型结构的数据对象 07 const obj = Compiler(html)
// 再调用 Render 进行渲染
Render(obj, document.body)
```
### 孰优孰略
首先是纯运行时的框架。由于它没有编译的过程，因此我们没办法分析用户提供的内容，但是如果加入编译步骤，可能就大不一样了，我们可以分析用户提供的内容，看看哪些内容未来可能会改变，哪些内容永远不会改变，这样我们就可以在编译的时候提取这些信息，然后将其传递给 Render 函数，Render 函数得到这些信息之后，就可以做进一步的优化了。然而，假如我们设计的框架是纯编译时的，那么它也可以分析用户提供的内容。由于不需要任何运行时，而是直接编译成可执行的 JavaScript 代码，因此性能可能会更好，但是这种做法有损灵活性，即用户提供的内容必须编译后才能用。

+ 编译时框架   [svelte](https://www.svelte.cn/)
+ 运行时+编译时  Vue.js 3


