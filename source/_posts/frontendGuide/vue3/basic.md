---
title: 基础知识
date: 2024-06-06 15:00:00
post: comments
enable: true
categories:
  - [前端开发手册, Vue3 奇妙之旅：轻松掌握新语法]
tags:
  - vue
  - vue3
---

# 基础知识

## Vue 3 的基本概念

Vue.js 是一个用于构建用户界面的渐进式框架，核心库只关注视图层。Vue 3 是 Vue.js 的最新版本，具备更好的性能和改进的开发体验。Vue 3 引入了 Composition API，支持更灵活的代码组织方式。Vue 3 相比 Vue 2 在性能、源码体积和 TypeScript 支持等方面都有显著提升。

## 项目初始化与配置

### 1. 创建 Vue 3 项目

在开始使用 Vue 3 之前，我们需要创建一个新的 Vue 3 项目。可以使用 Vite 来快速初始化项目。Vite 是一个新型的前端构建工具，具有快速、轻量的特点，非常适合用于 Vue 3 项目。

#### Vite

Vite（法语意为 "快速的"，发音 /vit/，发音同 "veet"）是一种新型前端构建工具，旨在显著提升前端开发体验。它主要由两部分组成：

1. **开发服务器**：基于原生 ES 模块，提供了丰富的内建功能，如速度极快的模块热更新（HMR）。
2. **构建指令**：使用 Rollup 打包代码，并预配置以输出高度优化的静态资源 ¹²。

#### 创建新项目

使用 Vite 创建一个新的 Vue 3 项目：

```bash
npm create vite@latest
```

#### 安装依赖

进入项目目录并安装依赖：

```bash
cd vue3-demo
npm install
```

#### 启动开发服务器

使用以下命令启动开发服务器：

```bash
npm run dev
```

开发服务器启动后，你可以在浏览器中访问 `http://localhost:5173` 查看你的 Vue 3 项目。

### 2. 项目配置

#### 配置文件

Vite 的主要配置文件是 `vite.config.js`。这是一个 JavaScript 模块，你可以在其中导出一个配置对象。默认的配置如下：

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});
```

#### 路径别名

你可以在 `vite.config.js` 中配置路径别名。例如，将 `@` 指向 `src` 目录：

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

使用示例：

```javascript
// App.vue
// import HelloWorld from './components/HelloWorld.vue';
import HelloWorld from '@/components/HelloWorld.vue';
```

#### 环境变量

Vite 支持使用 `.env` 文件来配置环境变量。在项目根目录下创建 `.env` 文件，并在其中定义变量：

```
VITE_APP_TITLE=My Vue 3 Project
```

在代码中使用这些变量：

```javascript
// App.vue
console.log(import.meta.env.VITE_APP_TITLE);
```

#### 代理配置

如果你需要在开发环境中代理 API 请求，可以在 `vite.config.js` 中配置代理：

```javascript
// 示例：ProxyDemo.vue
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/mock': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mock/, ''),
      },
    },
  },
});
```

这样，当你在开发环境中发送到 `/api` 的请求会被代理到 `http://backend-api`。

#### 其他配置

你可以根据项目需求，在 `vite.config.js` 中添加更多配置。例如，配置 CSS 预处理器、静态资源处理等。

更多详细配置可以参考 [Vite 官方文档](https://vitejs.dev/config/)。

### 3. 项目结构

一个典型的 Vue 3 项目结构如下：

```
vue3-demo/
├── public/         -- 公共目录，文件打包后原封不动放在根目录下面
│   └── favicon.ico
├── src/
│   ├── assets/     -- 存放静态资源，例如图片、字体等
│   ├── components/ -- 存放 Vue 组件
│   ├── views/      -- 存放视图组件，一般与路由对应
│   ├── App.vue     -- 根组件
│   ├── main.js     -- 应用入口文件
│   └── router.js   -- 路由配置文件
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js  -- vite 配置文件
```

通过以上步骤，你已经成功初始化并配置了一个使用 Vite 的 Vue 3 项目。接下来，你可以根据项目需求继续开发。

## 模版语法

### 插值

插值（Interpolation）是 Vue 模版语法中最基础的部分。通过插值语法，可以在模版中展示数据。

```html
<div>{{ message }}</div>
```

在上面的例子中，`{{ message }}` 会被替换为 Vue 实例中 `message` 属性的值。

### 指令

指令（Directives）是带有 `v-` 前缀的特殊属性，用于在模版中绑定行为。常用指令包括 `v-bind`、`v-model` 和 `v-for`。

#### v-bind

`v-bind` 指令用于绑定 HTML 属性。

```html
<a v-bind:href="url">点击这里</a>
```

#### v-model

`v-model` 指令用于创建双向数据绑定。

```html
<input v-model="message" placeholder="输入一些文字" />
```

#### v-for

`v-for` 指令用于渲染一个列表。

```html
<ul>
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</ul>
```

### 条件渲染

条件渲染使用 `v-if` 和 `v-show` 指令。

```html
<p v-if="seen">现在你看到我了</p>
<p v-show="seen">你还能看到我吗？</p>
```

`v-if` 完全销毁和重建元素，而 `v-show` 仅仅是切换元素的可见性。

### 进阶

#### 计算属性和监听器

计算属性（Computed Properties）和监听器（Watchers）是 Vue 的强大功能，用于处理复杂逻辑和异步操作。

##### 计算属性

计算属性是基于它们的依赖进行缓存的。

```js
computed: {
  reversedMessage() {
    return this.message.split('').reverse().join('')
  }
}
```

```html
<p>{{ reversedMessage }}</p>
```

##### 监听器

监听器用于在数据变化时执行异步操作或开销较大的操作。

```js
watch: {
  message(newVal, oldVal) {
    this.logMessage(newVal);
  }
}
```

#### 模版引用

模版引用（Template Refs）允许我们直接访问 DOM 元素或子组件实例。

```html
<input ref="input" v-model="message" />
```

```js
mounted() {
  this.$refs.input.focus();
}
```

#### 插槽

插槽（Slots）用于构建可复用的组件，允许在组件使用时传递内容。

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

使用插槽：

```html
<custom-component>
  <p>这是插入的内容</p>
</custom-component>
```

#### 动态组件

动态组件（Dynamic Components）允许我们在同一个挂载点动态切换不同的组件。

```html
<component :is="currentComponent"></component>
```

```js
data() {
  return {
    currentComponent: 'componentA'
  }
}
```

### 模版事件处理

#### 事件绑定

使用 `v-on` 指令绑定事件。

```html
<button v-on:click="doSomething">点击我</button>
<!-- 可使用 @ 简写 -->
<button @click="doSomething">点击我</button>
```

#### 事件修饰符

事件修饰符用于修改事件行为。

```html
<form v-on:submit.prevent="onSubmit">...</form>
<!-- 等效于 -->
<form @submit.prevent="onSubmit">...</form>
```

常用修饰符包括 `.stop`、`.prevent`、`.capture`、`.self`、`.once` 等。

### 模版中的条件与循环

#### 条件渲染

通过 `v-if`、`v-else-if` 和 `v-else` 实现复杂的条件渲染。

```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>C</div>
```

#### 列表渲染

通过 `v-for` 渲染列表，并使用 `key` 提高渲染效率。

```html
<ul>
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</ul>
```

### 总结

Vue 3 的模版语法提供了强大的功能和灵活性，使得我们可以轻松构建复杂的用户界面。通过合理使用插值、指令、计算属性、监听器、插槽和动态组件，我们可以实现高效、可维护的前端代码。

## Composition API 概述

在 Vue 3 中，Composition API 是一个全新的特性，旨在解决 Options API 在大型项目中的一些局限性。它通过提供一种更灵活和可重用的方式来组织组件逻辑，使得代码更加简洁和模块化。以下是 Composition API 的一些核心概念和其优点的概述。

### 核心概念

1. **setup 函数**
   `setup` 是 Composition API 的入口函数，它在组件实例创建之前执行。这个函数接收两个参数：`props` 和 `context`，其中 `context` 包括 `attrs`、`slots` 和 `emit`。

   ```javascript
   setup(props, context) {
     // 初始化逻辑
     return {
       // 公开给模板的变量和方法
     }
   }
   ```

2. **响应式状态**
   Composition API 提供了 `reactive` 和 `ref` 两个函数来创建响应式状态。

   - `reactive`：用于创建一个深层响应式对象。

     ```javascript
     import { reactive } from 'vue';
     const state = reactive({
       count: 0,
     });
     ```

   - `ref`：用于创建一个简单的响应式值。
     ```javascript
     import { ref } from 'vue';
     const count = ref(0);
     ```

3. **计算属性和侦听器**
   Composition API 也支持计算属性和侦听器，通过 `computed` 和 `watch` 函数实现。

   - `computed`：用于创建计算属性。

     ```javascript
     import { computed } from 'vue';
     const doubled = computed(() => state.count * 2);
     ```

   - `watch`：用于监听响应式数据的变化。
     ```javascript
     import { watch } from 'vue';
     watch(
       () => state.count,
       (newValue, oldValue) => {
         console.log(`Count changed from ${oldValue} to ${newValue}`);
       }
     );
     ```

### 优点

1. **逻辑复用**
   Composition API 允许将组件的逻辑拆分成可复用的函数，这些函数可以在不同组件中共享，避免了代码的重复。

2. **代码组织**
   通过将相关逻辑集中在一个函数内，Composition API 提供了一种更自然的方式来组织代码，尤其是在处理复杂组件时。

3. **类型推断**
   在 TypeScript 项目中，Composition API 可以更好地利用类型推断和类型检查功能，提供更好的开发体验。

4. **性能优化**
   由于 Composition API 在组件实例创建之前执行，减少了在 Options API 中因生命周期钩子引入的额外开销，从而提高了性能。

### 示例

以下是一个简单的计数器组件，展示了如何使用 Composition API：

```html
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    setup() {
      const count = ref(0);

      function increment() {
        count.value++;
      }

      return {
        count,
        increment,
      };
    },
  };
</script>
<!-- 或者 -->
<script setup>
  import { ref } from 'vue';

  const count = ref(0);

  function increment() {
    count.value++;
  }
</script>
```

在这个示例中，我们使用 `ref` 创建了一个响应式的 `count` 变量，并定义了一个 `increment` 方法来修改它。`setup` 函数返回的对象中的属性和方法会被暴露给模板。

## setup 函数详解

在 Vue 3 中，`setup` 函数是一个全新的特性，用于在组件内部进行初始化和配置。它是在组件实例创建之前执行的，并且是唯一一个具有副作用的生命周期钩子。通过 `setup` 函数，你可以访问组件的 props、context 和响应式数据等。

### 1. 使用方式

```javascript
import { ref } from 'vue';

export default {
  setup(props, context) {
    // 在这里进行初始化和配置
  },
};
```

### 2. 参数

- `props`: 组件的 props 对象，可以直接访问，也可以使用解构语法获取特定的 prop。
- `context`: 组件的上下文对象，包含一些常用的属性和方法，例如 `attrs`、`slots`、`emit` 等。

### 3. 返回值

`setup` 函数必须返回一个对象，该对象包含组件中需要响应式追踪的数据、方法等。

### 4. 响应式数据

通过 `ref`、`reactive` 等函数创建的数据会自动成为响应式数据，可以在模板中直接使用，并且在数据更新时，模板会自动更新。

### 5. 示例

```javascript
import { ref } from 'vue';

export default {
  props: {
    initialCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const count = ref(props.initialCount);

    const increment = () => {
      count.value++;
    };

    return {
      count,
      increment,
    };
  },
};
```

在模板中可以这样使用：

```html
<template>
  <button @click="increment">Increment</button>
  <p>Count: {{ count }}</p>
</template>
```

## Reactive 和 Ref 的使用

在 Vue 3 中，`ref` 和 `reactive` 是两种用于创建响应式数据的主要方式。它们都能够让数据在发生变化时自动更新相关的视图，但在使用方式和适用场景上略有不同。

### 1. ref

`ref` 是用于创建单个基本类型数据或对象的响应式引用。它返回一个包含 `.value` 属性的对象，该属性用于访问和修改数据。

#### 使用方式

```javascript
import { ref } from 'vue';

const count = ref(0); // 创建一个 ref

console.log(count.value); // 访问 ref 中的值

count.value++; // 修改 ref 中的值
```

#### 适用场景

- 简单的基本类型数据，如数字、字符串等。
- 无需直接访问内部属性的对象。

### 2. reactive

`reactive` 用于创建包含多个属性的响应式对象。它接收一个普通对象，并返回一个代理对象，该代理对象会拦截对象上的所有属性访问，使其成为响应式的。

#### 使用方式

```javascript
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello',
});

console.log(state.count); // 访问响应式对象的属性

state.count++; // 修改响应式对象的属性
```

#### 适用场景

- 复杂的对象，包含多个属性。
- 需要直接访问对象的属性。

### 3. reactive 的局限性

Vue 3 中的 `reactive()` 是一个非常强大的 API，用于创建响应式对象。然而，尽管它功能强大，但在某些情况下，它也有一些局限性和需要注意的地方。以下是一些常见的局限性：

#### 1. 不能使非对象类型响应式

`reactive()` 只能使对象类型（包括数组）变为响应式，而不能用于基本类型（如字符串、数字、布尔值等）。对于基本类型，可以使用 `ref()`。

```javascript
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello',
});
// 不能使 count 或 message 单独响应式
```

#### 2. 深层嵌套对象的性能问题

对于深层嵌套的对象，`reactive()` 会递归地将所有嵌套属性都变为响应式，这在某些情况下可能会导致性能问题。尽量避免过深的嵌套结构，或者仅在必要时使用 `reactive()`。

```javascript
import { reactive } from 'vue';

const deepState = reactive({
  level1: {
    level2: {
      level3: {
        level4: 'deep value',
      },
    },
  },
});
// 这种深层嵌套结构可能导致性能问题
```

#### 3. 对解构操作不友好

解构操作将会使变量失去响应性。

```javascript
const state = reactive({ count: 0 });

// 解构的时候 count 和 state.count 失去关联
let { count } = state;
// 不会影响 state.count
count++;

// the function receives a plain number and
// won't be able to track changes to state.count
// we have to pass the entire object in to retain reactivity
callSomeFunction(state.count);
```

#### 4. 不能直接对整个对象赋值

对整个对象赋值将会使对象失去响应性。

```javascript
let state = reactive({ count: 0 });

// the above reference ({ count: 0 }) is no longer being tracked
// (reactivity connection is lost!)
state = reactive({ count: 1 });
```

## 生命周期钩子

在 Vue 3 中，生命周期函数是组件在其生命周期中的特定阶段执行的函数。这些函数在组件的不同阶段被自动调用，使得开发者可以在这些阶段执行特定的逻辑，例如数据初始化、DOM 挂载、更新和销毁等。合理使用生命周期函数可以有效地管理组件的状态和行为。

![生命周期](../../img/vue3/lifecycle.png)

### Vue 3 选项式 API 的生命周期钩子

1. **beforeCreate**: 实例初始化之后，数据观测(data observation) 和事件配置(events) 之前被调用。
2. **created**: 实例创建完成，数据观测(data observation) 和事件配置(events) 之后被调用。
3. **beforeMount**: 在挂载开始之前被调用：相关的 render 函数首次被调用。
4. **mounted**: Vue 实例被挂载到 DOM 上后调用。
5. **beforeUpdate**: 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
6. **updated**: 由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。
7. **beforeUnmount**: 实例销毁之前调用。在这一步，实例仍然完全可用。
8. **unmounted**: Vue 实例销毁后调用。

示例：

```javascript
export default {
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  updated() {
    console.log('updated');
  },
  beforeUnmount() {
    console.log('beforeUnmount');
  },
  unmounted() {
    console.log('unmounted');
  },
};
```

### Vue 3 组合式 API 的生命周期 hooks

1. **onBeforeMount**: 在挂载开始之前调用。
2. **onMounted**: 组件挂载到 DOM 之后调用，通常在这里发起 API 请求。
3. **onBeforeUpdate**: 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
4. **onUpdated**: 由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。
5. **onBeforeUnmount**: 组件实例销毁之前调用。
6. **onUnmounted**: 组件实例销毁后调用。

以下是一个示例，展示了如何在组合式 API 中使用这些 hooks：

```javascript
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';

export default {
  setup() {
    const data = ref(null);

    onBeforeMount(() => {
      console.log('Component will mount');
    });

    onMounted(() => {
      console.log('Component mounted');
      fetchData();
    });

    onBeforeUpdate(() => {
      console.log('Component will update');
    });

    onUpdated(() => {
      console.log('Component updated');
    });

    onBeforeUnmount(() => {
      console.log('Component will unmount');
    });

    onUnmounted(() => {
      console.log('Component unmounted');
    });

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        data.value = await response.json();
      } catch (error) {
        console.error(error);
      }
    };

    return {
      data,
    };
  },
};
```

### 生命周期的实际应用

#### 组件初始化时获取数据

```javascript
<template>
  <div>{{ data }}</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const data = ref(null);

    onMounted(async () => {
      try {
        const response = await axios.get('https://api.example.com/data');
        data.value = response.data;
      } catch (error) {
        console.error(error);
      }
    });

    return {
      data,
    };
  },
};
</script>
```

#### 组件销毁前清理资源

```javascript
<template>
  <div>{{ data }}</div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const data = ref(null);
    const intervalId = ref(null);

    onMounted(async () => {
      try {
        const response = await axios.get('https://api.example.com/data');
        data.value = response.data;
      } catch (error) {
        console.error(error);
      }

      intervalId.value = setInterval(() => {
        console.log('Interval running');
      }, 1000);
    });

    onUnmounted(() => {
      if (intervalId.value) {
        clearInterval(intervalId.value);
        console.log('Interval cleared');
      }
    });

    return {
      data,
    };
  },
};
</script>
```

通过这些生命周期钩子和组合式 API，你可以在 Vue 3 中更灵活地管理组件的状态和副作用。
