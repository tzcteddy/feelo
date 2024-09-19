---
title: 深入理解 Vue 3 组件
date: 2024-06-06 14:00:00
post: comments
enable: true
categories:
  - [前端开发手册, Vue3 奇妙之旅：轻松掌握新语法]
tags:
  - vue
  - vue3
---

## 1. 组件基础

### 1.1 什么是组件

组件是 Vue 应用程序的基本构建块。每个组件都封装了特定的功能或 UI 部分，可以像 HTML 元素一样使用。

### 1.2 定义组件

在 Vue 3 中，可以使用 `defineComponent` 方法定义组件：

```javascript
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyComponent',
  data() {
    return {
      message: 'Hello, Vue 3!'
    };
  },
  template: `<div>{{ message }}</div>`
});
```

## 2. 组件形式

### 2.1 单文件组件（Single File Component, SFC）

单文件组件是 Vue 3 中最常见的组件形式，使用 `.vue` 文件扩展名。一个 `.vue` 文件包含 `<template>`、`<script>` 和 `<style>` 三个部分。

```html
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, Vue 3!'
    };
  }
};
</script>

<style>
div {
  color: blue;
}
</style>
```

### 2.2 纯 JS 组件

不常用，需要配置 alias `vue: 'vue/dist/vue.esm-bundler.js'`，使用 `.js` 文件扩展名。使用选项式 api 的 template 属性提供字符串形式的模板。

```javascript
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'JsComponent',
  data() {
    return {
      message: 'Hello, form js component'
    };
  },
  template: `<div>{{ message }}</div>`
});
```

### 2.3 全局注册和局部注册

#### 全局注册

全局注册的组件可以在任何地方使用。通过 `app.component` 方法注册：

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import MyComponent from './components/MyComponent.vue';

const app = createApp(App);
app.component('MyComponent', MyComponent);
app.mount('#app');
```

#### 局部注册

局部注册的组件只能在注册它们的组件中使用：

```javascript
import MyComponent from './components/MyComponent.vue';

// 使用 setup 可以跳过 components 配置，直接使用
export default {
  components: {
    MyComponent
  }
};
```

## 3. 组件引用

在模板中引用组件非常简单，只需使用组件名称作为标签即可：

```html
<template>
  <div>
    <MyComponent />
  </div>
</template>

<script>
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  }
};
</script>
```

## 4. 组件之间的传值

在 Vue 中，父组件和子组件是组件之间的一种层级关系。让我详细解释一下这些概念以及为什么会这样命名。

### 4.1 父子组件概念

1. **父组件**：
   - 父组件是包含子组件的组件。它负责定义子组件的数据和行为，并将其传递给子组件进行处理。
   - 父组件可以通过属性（`props`）向子组件传递数据和事件。子组件可以使用这些属性来渲染自身或执行一些操作。
   - 举个例子，如果我们有一个页面组件，它包含了一个按钮组件，那么页面组件就是父组件，按钮组件就是子组件。

2. **子组件**：
   - 子组件是被包含在父组件中的组件。它通常用于封装一部分功能或界面元素，以便在不同的地方重复使用。
   - 子组件可以接收父组件传递的数据，并根据这些数据来展示内容或执行操作。
   - 例如，我们可以创建一个自定义的日期选择器组件，然后在不同的页面中多次使用它作为子组件。

为什么这样命名呢？这是因为在组件层级结构中，父组件通常包含了子组件，就像家庭中的父母和子女一样。这种命名方式有助于我们理解组件之间的关系，以及数据和事件是如何在它们之间流动的。

### 4.2 父组件向子组件传值

使用 `props` 可以实现父组件向子组件传递数据。首先，在子组件中定义 `props`：

```javascript
export default {
  props: {
    message: String
  },
  template: `<div>{{ message }}</div>`
};
```

然后在父组件中使用子组件时传递数据：

```html
<template>
  <div>
    <MyComponent message="Hello from parent" />
  </div>
</template>

<script>
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  }
};
</script>
```

### 4.3 子组件向父组件传值

使用事件和 `emit` 方法可以实现子组件向父组件传递数据。在子组件中触发事件：

```javascript
export default {
  methods: {
    sendMessage() {
      this.$emit('message-sent', 'Hello from child');
    }
  },
  template: `<button @click="sendMessage">Send Message</button>`
};
```

在父组件中监听事件：

```html
<template>
  <div>
    <MyComponent @message-sent="handleMessage" />
  </div>
</template>

<script>
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  },
  methods: {
    handleMessage(message) {
      console.log(message);
    }
  }
};
</script>
```

### 4.4 使用 `v-model` 实现双向绑定

Vue 3 支持在自定义组件上使用 `v-model` 实现双向绑定。首先，在子组件中定义 `modelValue` prop 并触发 `update:modelValue` 事件：

```javascript
export default {
  props: {
    modelValue: String
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  },
  template: `<input :value="modelValue" @input="updateValue" />`
};
```

在父组件中使用 `v-model`：

```html
<template>
  <div>
    <MyComponent v-model="message" />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  },
  data() {
    return {
      message: 'Hello, Vue 3!'
    };
  }
};
</script>
```

## 5. 结论

Vue 3 的组件系统提供了强大的工具和灵活的方式来构建现代化的 Web 应用程序。通过理解组件的基础知识、形式、引用方法和传值机制，开发者可以更加高效地开发和维护应用。希望这篇文章能帮助你更好地掌握 Vue 3 组件的使用。