---
title: 《Vue.js 设计与实现》第六章 原始值的响应式方案
date: 2024-04-25 10:00:00
post: comments
enable: true
categories: 
- Vue.js 设计与实现
tags: 
- 读书分享
- vue原理
---

# 第六章 原始值的响应式方案

> 在第 5 章中，我们讨论了非原始值的响应式方案，本章我们将讨论原始值的响应式方案。

## 本章内容

- 引入 ref 的概念
- 响应丢失问题
- 自动脱 ref

原始值指的是**Boolean、Number、BigInt、String、Symbol、undefined 和 null 等**类型的值。在 JavaScript 中，原始值是按值传递的，而非按引用传递。这意味着，如果一个函数接收原始值作为参数，那么形参与实参之间没有引用关系，它们是两个完全独立的值，对形参的修改不会影响实参。另外，JavaScript 中的 Proxy 无法提供对原始值的代理，因此想要将原始值变成响应式数据，就必须对其做一层包裹，也就是我们接下来要介绍的 ref。

### 6.1 引入 ref 的概念

由于 Proxy 的代理目标必须是非原始值，所以我们没有任何手段拦截对原始值的操作，例如：

```JS
let str = 'vue'
// 无法拦截对值的修改
str = 'vue3'
```

对于这个问题，我们能够想到的唯一办法是，使用一个非原始值去“包裹”原始值，例如使用一个对象包裹原始值：

```JS
const wrapper = {
  value: 'vue'
}
// 可以使用 Proxy 代理 wrapper，间接实现对原始值的拦截
const name = reactive(wrapper)
name.value // vue
// 修改值可以触发响应
name.value = 'vue3'
```

但这样做会导致两个问题：

- 用户为了创建一个响应式的原始值，不得不顺带创建一个包裹对象；
- 包裹对象由用户定义，而这意味着不规范。用户可以随意命名，例如 wrapper.value、wrapper.val 都是可以的。

为了解决这两个问题，我们可以封装一个函数，将包裹对象的创建工作都封装到该函数中：

```JS
// 封装一个 ref 函数
function ref(val) {
  // 在 ref 函数内部创建包裹对象
  const wrapper = {
    value: val
  }
  // 将包裹对象变成响应式数据
  return reactive(wrapper)
}
```

如上面的代码所示，我们把创建 wrapper 对象的工作封装到 ref 函数内部，然后使用 reactive 函数将包裹对象变成响应式数据并返回。这样我们就解决了上述两个问题。运行如下测试代码：

```JS
// 创建原始值的响应式数据
const refVal = ref(1)
effect(() => {
  // 在副作用函数内通过 value 属性读取原始值
  console.log(refVal.value)
})
// 修改值能够触发副作用函数重新执行
refVal.value = 2
```

上面这段代码能够按照预期工作。现在是否一切都完美了呢？并不是，接下来我们面临的第一个问题是，如何区分 refVal 到底是原始值的包裹对象，还是一个非原始值的响应式数据，如以下代码所示：

```JS
const refVal1 = ref(1)
const refVal2 = reactive({ value: 1 })
```

思考一下，这段代码中的 refVal1 和 refVal2 有什么区别呢？从我们的实现来看，它们没有任何区别。但是，我们有必要区分一个数据到底是不是 ref，因为这涉及下文讲解的自动脱 ref 能力。
想要区分一个数据是否是 ref 很简单，怎么做呢？如下面的代码所示：

```JS
// 封装一个 ref 函数
function ref(val) {
  const wrapper = {
    value: val
  }
  // 使用 Object.defineProperty 在 wrapper 对象上定义一个不可枚举的属性 __v_isRef，并且值为 true
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return reactive(wrapper)
}
```

我们使用 Object.defineProperty 为包裹对象 wrapper 定义了一个不可枚举且不可写的属性 **v_isRef，它的值为 true，代表这个对象是一个 ref，而非普通对象。这样我们就可以通过检查**v_isRef 属性来判断一个数据是否是 ref 了

### 6.2 响应丢失问题

ref 除了能够用于原始值的响应式方案之外，还能用来解决响应丢失问题。首先，我们来看什么是响应丢失问题。在编写 Vue.js 组件时，我们通常要把数据暴露到模板中使用，例如：

```JS
export default {
  setup() {
    // 响应式数据
    const obj = reactive({ foo: 1, bar: 2 })

    // 将数据暴露到模板中
    return {
      ...obj
    }
  }
}
```

接着，我们就可以在模板中访问从 setup 中暴露出来的数据：

```JS
<template>
  <p>{{ foo }} / {{ bar }}</p>
</template>
```

然而，这么做会导致响应丢失。其表现是，当我们修改响应式数据的值时，不会触发重新渲染：

```JS
export default {
  setup() {
    // 响应式数据
    const obj = reactive({ foo: 1, bar: 2 })
    // 1s 后修改响应式数据的值，不会触发重新渲染
    setTimeout(() => {
      obj.foo = 100
    }, 1000)

    return {
      ...obj
    }
  }
}
```

为什么会导致响应丢失呢？这是由展开运算符（...）导致的。实际上，下面这段代码：

```JS
return {
  ...obj
}
// 等价于：
return {
  foo: 1,
  bar: 2
}
```
可以发现，这其实就是返回了一个普通对象，它不具有任何响应式能力。把一个普通对象暴露到模板中使用，是不会在渲染函数与响应式数据之间建立响应联系的。所以当我们尝试在一个定时器中修改bj.foo 的值时，不会触发重新渲染。我们可以用另一种方式来描述响应丢失问题：

```JS
// obj 是响应式数据
const obj = reactive({ foo: 1, bar: 2 })
// 将响应式数据展开到一个新的对象 newObj
const newObj = {
  ...obj
}
effect(() => {
  // 在副作用函数内通过新的对象 newObj 读取 foo 属性值
  console.log(newObj.foo)
})
// 很显然，此时修改 obj.foo 并不会触发响应
obj.foo = 100
```
如上面的代码所示，首先创建一个响应式的数据对象 obj，然后使用展开运算符得到一个新的对象 newObj，它是一个普通对象，不具有响应能力。这里的关键点在于，副作用函数内访问的是普通对象newObj，它没有任何响应能力，所以当我们尝试修改 obj.foo 的值时，不会触发副作用函数重新执行。
如何解决这个问题呢？换句话说，有没有办法能够帮助我们实现：在副作用函数内，即使通过普通对象 newObj 来访问属性值，也能够建立响应联系？其实是可以的，代码如下：
```JS
// obj 是响应式数据
const obj = reactive({ foo: 1, bar: 2 })
// newObj 对象下具有与 obj 对象同名的属性，并且每个属性值都是一个对象，
// 该对象具有一个访问器属性 value，当读取 value 的值时，其实读取的是 obj对象下相应的属性值
const newObj = {
  foo: {
    get value() {
      return obj.foo
    }
  },
  bar: {
    get value() {
      return obj.bar
    }
  }
}
effect(() => {
  // 在副作用函数内通过新的对象 newObj 读取 foo 属性值
  console.log(newObj.foo.value)
})
// 这时能够触发响应了
obj.foo = 100
```
在上面这段代码中，我们修改了 newObj 对象的实现方式。可以看到，在现在的 newObj 对象下，具有与 obj 对象同名的属性，而且每个属性的值都是一个对象，例如 foo 属性的值是：
```JS
{
 get value() {
    return obj.foo
  }
}
```
该对象有一个访问器属性 value，当读取 value 的值时，最终读取的是响应式数据 obj 下的同名属性值。也就是说，当在副作用函数内读取 newObj.foo 时，等价于间接读取了 obj.foo 的值。这样响应式数据自然能够与副作用函数建立响应联系。于是，当我们尝试修改 obj.foo 的值时，能够触发副作用函数重新执行。
观察 newObj 对象，可以发现它的结构存在相似之处：
```JS
const newObj = {
  foo: {
    get value() {
      return obj.foo
    }
  },
  bar: {
    get value() {
      return obj.bar
    }
  }
}
```
foo 和 bar 这两个属性的结构非常像，这启发我们将这种结构抽象出来并封装成函数，如下面的代码所示：
```JS
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    }
  }
  return wrapper
}

```
toRef 函数接收两个参数，第一个参数 obj 是一个响应式数据，第二个参数是 obj 对象的一个键。该函数会返回一个类似于 ref 结构的 wrapper 对象。有了 toRef 函数后，我们就可以重新实现newObj 对象了：
```JS
const newObj = {
  foo: toRef(obj, 'foo'),
  bar: toRef(obj, 'bar')
}
```

可以看到，代码变得非常简洁。但如果响应式数据 obj 的键非常多，我们还是要花费很大力气来做这一层转换。为此，我们可以封装toRefs 函数，来批量地完成转换：
```JS
function toRefs(obj) {
  const ret = {}
  // 使用 for...in 循环遍历对象
  for (const key in obj) {
    // 逐个调用 toRef 完成转换
    ret[key] = toRef(obj, key)
  }
  return ret
}
```

现在，我们只需要一步操作即可完成对一个对象的转换：
```JS
const newObj = { ...toRefs(obj) }

//  可以使用如下代码进行测试：
const obj = reactive({ foo: 1, bar: 2 })
const newObj = { ...toRefs(obj) }
console.log(newObj.foo.value) // 1
console.log(newObj.bar.value) // 2
```
但为了概念上的统一，我们会将通过 toRef 或 toRefs 转换后得到的结果视为真正的 ref数据，为此我们需要为 toRef 函数增加一段代码：
```JS
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    }
  }
  // 定义 __v_isRef 属性
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return wrapper
}
```
可以看到，我们使用 Object.defineProperty 函数为wrapper 对象定义了 __v_isRef 属性。这样，toRef 函数的返回值就是真正意义上的 ref 了。通过上述讲解我们能注意到，ref 的作用不仅仅是实现原始值的响应式方案，它还用来解决响应丢失问题。
但上文中实现的 toRef 函数存在缺陷，即通过 toRef 函数创建的 ref 是只读的，如下面的代码所示：
```JS
const obj = reactive({ foo: 1, bar: 2 })
const refFoo = toRef(obj, 'foo')

refFoo.value = 100 // 无效
```

这是因为 toRef 返回的 wrapper 对象的 value 属性只有getter，没有 setter。为了功能的完整性，我们应该为它加上setter 函数，所以最终的实现如下：
```JS
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    // 允许设置值
    set value(val) {
      obj[key] = val
    }
  }

  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })

  return wrapper
}
```
可以看到，当设置 value 属性的值时，最终设置的是响应式数据的同名属性的值，这样就能正确地触发响应了。

### 6.3 自动脱 ref
toRefs 函数的确解决了响应丢失问题，但同时也带来了新的问题。由于 toRefs 会把响应式数据的第一层属性值转换为 ref，因此必须通过 value 属性访问值，如以下代码所示：
```JS
const obj = reactive({ foo: 1, bar: 2 })
obj.foo // 1
obj.bar // 2

const newObj = { ...toRefs(obj) }
// 必须使用 value 访问值
newObj.foo.value // 1
newObj.bar.value // 2
```
这其实增加了用户的心智负担，因为通常情况下用户是在模板中访问数据的，例如：
```JS
<p>{{ foo }} / {{ bar }}</p>

// 用户肯定不希望编写下面这样的代码：
<p>{{ foo.value }} / {{ bar.value }}</p>
```

因此，我们需要自动脱 ref 的能力。所谓自动脱 ref，指的是属性的访问行为，即如果读取的属性是一个 ref，则直接将该 ref 对应的 value 属性值返回，例如：
```JS
newObj.foo // 1
```

可以看到，即使 newObj.foo 是一个 ref，也无须通过newObj.foo.value 来访问它的值。要实现此功能，需要使用Proxy 为 newObj 创建一个代理对象，通过代理来实现最终目标，这时就用到了上文中介绍的 ref 标识，即 __v_isRef 属性，如下面的
代码所示：
```JS
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      // 自动脱 ref 实现：如果读取的值是 ref，则返回它的 value 属性值
      return value.__v_isRef ? value.value : value
    }
  })
}

// 调用 proxyRefs 函数创建代理
const newObj = proxyRefs({ ...toRefs(obj) })
```
在上面这段代码中，我们定义了 proxyRefs 函数，该函数接收一个对象作为参数，并返回该对象的代理对象。代理对象的作用是拦截 get 操作，当读取的属性是一个 ref 时，则直接返回该 ref 的value 属性值，这样就实现了自动脱 ref：
```JS
console.log(newObj.foo) // 1
console.log(newObj.bar) // 2
```

实际上，我们在编写 Vue.js 组件时，组件中的 setup 函数所返回的数据会传递给 proxyRefs 函数进行处理：
```JS
const MyComponent = {
  setup() {
    const count = ref(0)

    // 返回的这个对象会传递给 proxyRefs
    return { count }
  }
}
```
这也是为什么我们可以在模板直接访问一个 ref 的值，而无须通过 value 属性来访问：
```JS
 <p>{{ count }}</p>
 ```
既然读取属性的值有自动脱 ref 的能力，对应地，设置属性的值也应该有自动为 ref 设置值的能力，例如：
```JS
newObj.foo = 100 // 应该生效
```

实现此功能很简单，只需要添加对应的 set 拦截函数即可：
```JS
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return value.__v_isRef ? value.value : value
    },
    set(target, key, newValue, receiver) {
      // 通过 target 读取真实值
      const value = target[key]
      // 如果值是 Ref，则设置其对应的 value 属性值
      if (value.__v_isRef) {
        value.value = newValue
        return true
      }
      return Reflect.set(target, key, newValue, receiver)
    }
  })
}
```
如上面的代码所示，我们为 proxyRefs 函数返回的代理对象添加了 set 拦截函数。如果设置的属性是一个 ref，则间接设置该 ref的 value 属性的值即可。

实际上，自动脱 ref 不仅存在于上述场景。在 Vue.js 中，reactive 函数也有自动脱 ref 的能力，如以下代码所示：
```JS
const count = ref(0)
const obj = reactive({ count })

obj.count // 0
```
可以看到，obj.count 本应该是一个 ref，但由于自动脱 ref能力的存在，使得我们无须通过 value 属性即可读取 ref 的值。这么设计旨在减轻用户的心智负担，因为在大部分情况下，用户并不知道一个值到底是不是 ref。有了自动脱 ref 的能力后，用户在模板中使用响应式数据时，将不再需要关心哪些是 ref，哪些不是 ref。

### 6.4 总结
- 在本章中，我们首先介绍了 ref 的概念。ref 本质上是一个“包裹对象”。因为 JavaScript 的 Proxy 无法提供对原始值的代理，所以我们需要使用一层对象作为包裹，间接实现原始值的响应式方案。由于“包裹对象”本质上与普通对象没有任何区别，因此为了区分 ref 与普通响应式对象，我们还为“包裹对象”定义了一个值为 true 的属性，即__v_isRef，用它作为 ref 的标识。
- ref 除了能够用于原始值的响应式方案之外，还能用来解决响应丢失问题。为了解决该问题，我们实现了 toRef 以及toRefs 这两个函数。它们本质上是对响应式数据做了一层包装，或者叫作“访问代理”。
- 最后，我们讲解了自动脱 ref 的能力。为了减轻用户的心智负担，我们自动对暴露到模板中的响应式数据进行脱 ref 处理。这样，用户在模板中使用响应式数据时，就无须关心一个值是不是 ref 了。