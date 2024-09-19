---
title: 深入理解 Vue3 的响应式原理
date: 2024-06-06 12:00:00
post: comments
enable: true
categories:
  - [前端开发手册, 进阶奇妙旅程：解锁 Vue3 的高级魔法]
tags:
  - vue
  - vue3
---

### 深入理解 Vue 3 的响应式原理

#### 前言

Vue 3 引入了全新的响应式系统，进一步提升了开发者的体验和应用的性能。响应式系统是 Vue 框架的核心特性之一，它通过数据驱动的方式，让开发者能够高效地管理和更新视图。今天，我们将深入探讨 Vue 3 的响应式原理，了解其基本概念、实现原理以及相关优化策略。

#### 响应式系统的基本概念

Vue 的响应式系统使得数据的变化能够自动触发视图的更新，而不需要手动操作 DOM。这一特性主要通过以下几个概念实现：

1. **数据驱动**：Vue 通过数据来驱动视图的变化，当数据发生变化时，视图会自动更新。
2. **双向绑定**：数据和视图之间是双向绑定的，数据的变化会反映到视图上，视图的变化（如用户输入）也会更新数据。
3. **依赖追踪**：Vue 自动追踪组件中数据的依赖关系，从而在数据变化时，只更新受影响的部分视图。

#### 实现单个值的响应式

在普通 js 代码中，不会有响应式变化，例如下面这段代码

```javascript
let price = 10, quantity = 2;
const total = price * quantity;
console.log(`total: ${total}`); // total: 20
price = 20;
console.log(`total: ${total}`); // total: 20
```

在修改 price 变量的值后， total 的值并没有发生改变。

那么如何修改上面代码，让 total 能够自动更新呢？我们其实可以将修改 total 值的方法保存起来，等到与 total 值相关的变量（如 price 或 quantity 变量的值）发生变化时，触发该方法，更新 total 即可。我们可以这么实现：

```javascript
let price = 10, quantity = 2, total = 0;
const dep = new Set();//初始化 Set 类型的 dep 变量，用来存储需要执行的副作用函数
const effect = () => {
  total = price * quantity
}
const track = ()=>{//创建 track 函数将需要执行的副作用函数保存到 dep 变量中
  dep.add(effect)
}
const trigger = ()=>{//创建 trigger 函数用来执行所有副作用
  dep.forEach(effect => effect())
}
track();
console.log(`total: ${total}`); // total: 0
trigger();
console.log(`total: ${total}`); // total: 20
price = 20;
trigger();
console.log(`total: ${total}`); // total: 40
```

在每次 price 或 quantity 变化之后调用 trigger()执行所有副作用，就可以将 total 值更新为最新的值

#### 实现单个对象的响应式
```javascript
let product = { price: 10, quantity: 2 }, total = 0;
const depsMap = new Map(); // 初始化一个 Map 类型的 depsMap 变量，用来保存每个需要响应式变化的对象属性（key 为对象的属性， value 为前面 Set 集合）
const effect = () => { total = product.price * product.quantity };
const track = key => {     // 创建 track() 函数，用来将需要执行的副作用保存到 depsMap 变量中对应的对象属性下
  let dep = depsMap.get(key);
  if(!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(effect);
}

const trigger = key => {  // 创建 trigger() 函数，用来执行 dep 变量中指定对象属性的所有副作用
  let dep = depsMap.get(key);
  if(dep) {
    dep.forEach( effect => effect() );
  }
};

track('price');
console.log(`total: ${total}`); // total: 0
effect();
console.log(`total: ${total}`); // total: 20
product.price = 20;
trigger('price');
console.log(`total: ${total}`); // total: 40
```

这样就实现监听对象的响应式变化，在 product 对象中的属性值发生变化， total 值也会跟着更新。

#### 实现多个对象的响应式

```javascript
let product = { price: 10, quantity: 2 }, total = 0;
const targetMap = new WeakMap();     // 1、初始化 targetMap，保存观察对象
const effect = () => { total = product.price * product.quantity };
const track = (target, key) => {     // 2、收集依赖
  let depsMap = targetMap.get(target);
  if(!depsMap){
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if(!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(effect);
}

const trigger = (target, key) => {  // 3、执行指定对象的指定属性的所有副作用
  const depsMap = targetMap.get(target);
  if(!depsMap) return;
    let dep = depsMap.get(key);
  if(dep) {
    dep.forEach( effect => effect() );
  }
};

track(product, 'price');
console.log(`total: ${total}`); // total: 0
effect();
console.log(`total: ${total}`); // total: 20
product.price = 20;
trigger(product, 'price');
console.log(`total: ${total}`); // total: 40
```
1、初始化一个 WeakMap 类型的 targetMap 变量，用来存储每个响应式对象；

2、创建 track() 函数，用来将需要执行的副作用保存到指定对象（ target ）的依赖中

3、创建 trigger() 函数，用来执行指定对象（ target ）中指定属性（ key ）的所有副作用；

这样就实现监听对象的响应式变化，在 product 对象中的属性值发生变化， total 值也会跟着更新。

#### reactive 与 ref 的实现原理

上面每次都需要手动出发 track 收集依赖，再通过 trigger 执行所有的副作用，vue 则是自动调用实现数据更新

Vue 3 引入了 `reactive` 和 `ref` API 来创建响应式数据。这两者的实现原理主要依赖于 JavaScript 的 Proxy 对象和 Reflect API。

#### Proxy 对象与 Reflect API 的使用

Vue 3 的响应式系统主要基于 JavaScript 的 Proxy 对象和 Reflect API 实现。

##### Proxy 对象

Proxy 对象用于定义自定义的行为（如拦截属性访问和修改）以实现响应式特性。它可以代理对目标对象的基本操作（如读取、写入和删除属性）。

```javascript
const target = {
  message: 'Hello'
};

const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : 'Property not found';
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.message); // 输出 "Hello"
console.log(proxy.nonExistent); // 输出 "Property not found"
```

##### Reflect API

Reflect API 提供了一组静态方法，用于与 Proxy 对象的方法对应，确保对目标对象的基本操作一致。Vue 使用 Reflect API 来执行默认的对象操作，同时实现响应式特性。

```javascript
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop, receiver);
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.message); // 输出 "Getting message" 和 "Hello"
```

##### reactive

`reactive` 函数用于创建一个深层次的响应式对象。它使用 JavaScript 的 Proxy 对象来拦截对对象属性的访问和修改，从而实现响应式。

```javascript
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello Vue 3'
});

state.count++; // 视图会自动更新
```

**实现原理**：

1. **创建代理**：当调用 `reactive` 函数时，Vue 会创建一个 Proxy 对象来代理传入的原始对象。
2. **拦截操作**：Proxy 对象通过 `get` 和 `set` 等拦截器（traps）来拦截对原始对象的属性访问和修改。
3. **依赖追踪**：在 `get` 拦截器中，Vue 会记录依赖关系，将当前的副作用函数（例如渲染函数）与被访问的属性关联起来。
4. **触发更新**：在 `set` 拦截器中，Vue 会在属性值发生变化时，触发与该属性相关的副作用函数，更新视图。

```javascript
function createReactiveObject(target, handlers) {
  return new Proxy(target, handlers);
}

const handlers = {
  get(target, key, receiver) {
    // 依赖追踪
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    // 触发更新
    trigger(target, key);
    return result;
  }
};

const state = createReactiveObject({ count: 0 }, handlers);
```

##### ref

`ref` 函数用于创建一个包含单个值的响应式对象。它通常用于处理基本类型的数据（如字符串、数字）。

```javascript
import { ref } from 'vue';

const count = ref(0);

count.value++; // 视图会自动更新
```

**实现原理**：

1. **包装值**：当调用 `ref` 函数时，Vue 会将传入的值包装在一个对象的 `value` 属性中。
2. **创建代理**：Vue 为该对象创建一个 Proxy 对象，拦截对 `value` 属性的访问和修改。
3. **依赖追踪**：在 `get` 拦截器中，Vue 会记录依赖关系，将当前的副作用函数与 `value` 属性关联起来。
4. **触发更新**：在 `set` 拦截器中，Vue 会在 `value` 属性值发生变化时，触发与其相关的副作用函数，更新视图。

```javascript
function ref(value) {
  return createRef(value);
}

function createRef(rawValue) {
  const r = {
    get value() {
      // 依赖追踪
      track(r, 'value');
      return rawValue;
    },
    set value(newVal) {
      rawValue = newVal;
      // 触发更新
      trigger(r, 'value');
    }
  };
  return r;
}

const count = ref(0);
```

#### 响应式系统中的优化策略

为了提高响应式系统的性能，Vue 3 采用了一些优化策略：

1. **懒执行**：计算属性和监听器都是惰性求值的，只有在依赖的数据实际变化时才会重新计算或执行。
2. **依赖追踪**：通过追踪依赖关系，Vue 3 只会在必要的时候更新视图，避免不必要的重新渲染。
3. **分块更新**：Vue 3 在内部通过任务队列和批处理机制，将多次数据变化合并为一次更新，减少性能开销。

#### 结语

通过这篇文章，我们深入了解了 Vue 3 的响应式原理，包括响应式系统的基本概念、`reactive` 与 `ref` 的实现原理、Proxy 对象与 Reflect API 的使用以及响应式系统中的优化策略。希望通过对这些内容的理解，你能够更好地利用 Vue 3 的响应式系统，提高开发效率和应用性能。
