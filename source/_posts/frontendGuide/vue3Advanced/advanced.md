---
title: 进阶概念
date: 2024-06-06 13:00:00
post: comments
enable: true
categories:
  - [前端开发手册, 进阶奇妙旅程：解锁 Vue3 的高级魔法]
tags:
  - vue
  - vue3
---

# 进阶概念

## 依赖注入（Provide/Inject）

`provide` 和 `inject` 用于跨组件共享数据，通常在父组件中使用 `provide` 提供数据，在子组件中使用 `inject` 接收数据。

```javascript
// ParentComponent.vue
import { provide } from 'vue';

export default {
  setup() {
    provide('message', 'Hello from Parent');
  }
}

// ChildComponent.vue
import { inject } from 'vue';

export default {
  setup() {
    const message = inject('message');
    return { message };
  }
}
```

### 注意事项

- **依赖关系**：确保提供的数据在注入之前已经存在，否则会导致注入失败。
- **作用域**：提供的数据仅在当前组件树中有效。

## 自定义指令

自定义指令是 Vue 框架中用于对 DOM 元素进行复杂操作的一种方式。它可以帮助我们封装常用的 DOM 操作逻辑，提高代码的可重用性和可维护性。以下是详细的介绍，包括全局注册、局部注册、自定义 hooks 以及指令钩子和参数。

### 使用方法

自定义指令在模板中通过 `v-` 前缀使用。可以传递参数、修饰符和绑定值。

### 全局注册自定义指令

全局注册自定义指令使得指令可以在整个应用中使用。我们需要在应用实例上通过 `directive` 方法进行注册。

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// 定义全局指令
app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});

app.mount('#app');
```

在模板中使用全局指令：

```html
<template>
  <input v-focus />
</template>
```

### 局部注册自定义指令

局部注册自定义指令使得指令仅在特定组件中可用。这种方式适合特定组件中使用的指令，避免全局污染。

#### 使用 Options API

```javascript
<template>
  <input v-focus />
</template>
<script>
  export default {
    directives: {
      focus: {
        mounted(el) {
          el.focus();
        },
      },
    },
  };
</script>
```

#### 使用 Composition API

```javascript
<template>
  <input v-focus />
</template>
<script setup>
  const vFocus = {
    mounted: (el) => el.focus()
  }
</script>
```

### 指令钩子

一个指令的定义对象可以提供几种钩子函数 (都是可选的)：

```javascript
const myDirective = {
  created(el, binding, vnode, prevVnode) {
    // 在绑定元素的 attribute 前或事件监听器应用前调用
  },
  beforeMount(el, binding, vnode, prevVnode) {
    // 在元素被插入到 DOM 前调用
  },
  mounted(el, binding, vnode, prevVnode) {
    // 在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
  },
  beforeUpdate(el, binding, vnode, prevVnode) {
    // 绑定元素的父组件更新前调用
  },
  updated(el, binding, vnode, prevVnode) {
    // 在绑定元素的父组件及他自己的所有子节点都更新后调用
  },
  beforeUnmount(el, binding, vnode, prevVnode) {
    // 绑定元素的父组件卸载前调用
  },
  unmounted(el, binding, vnode, prevVnode) {
    // 绑定元素的父组件卸载后调用
  },
};
```

### 钩子参数

指令的钩子会传递以下几种参数：

- `el`：指令绑定到的元素。这可以用于直接操作 DOM。
- `binding`：一个对象，包含以下属性。
  - `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令的定义对象。
- `vnode`：代表绑定元素的底层 VNode。
- `prevVnode`：代表之前的渲染中指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

```javascript
<div v-example:foo.bar="baz">
```

binding 参数会是一个这样的对象：

```javascript
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```

#### 传递参数

通过指令名后加参数来传递参数。

```html
<template>
  <div v-focus="true"></div>
</template>

<script>
  export default {
    directives: {
      focus: {
        mounted(el, binding) {
          if (binding.value) {
            el.focus();
          }
        },
      },
    },
  };
</script>
```

### 使用注意事项

1. **命名冲突**：避免与内置指令或其他自定义指令名称冲突。
2. **内存泄漏**：确保在 `unmounted` 钩子中清理所有绑定的事件和资源，避免内存泄漏。
3. **复用性**：自定义指令的逻辑应尽量通用，以便在多个组件中复用。
4. **性能**：避免在指令钩子中执行耗时操作，影响性能。

### 适用场景

1. **表单处理**：自动聚焦输入框、验证输入内容等。
2. **事件处理**：处理复杂的 DOM 事件绑定和解绑。
3. **动画效果**：实现复杂的动画效果。
4. **拖拽操作**：实现元素拖拽功能。
5. **工具提示**：实现悬停提示信息等。

通过以上内容，希望大家对 Vue 3 中自定义指令的使用有一个全面的了解。自定义指令是 Vue 强大且灵活的功能之一，可以极大地提高开发效率和代码可维护性。

## 动态组件与异步组件

Vue 3 提供了强大的动态组件和异步组件功能，使得组件的使用更加灵活和高效。动态组件允许根据条件动态渲染不同的组件，而异步组件则允许按需加载组件，从而提高应用的性能。

### 动态组件

动态组件允许我们根据条件动态切换组件。这对于需要在同一位置显示不同组件的场景非常有用。使用 `component` 标签和 `is` 属性可以实现这一点。

#### 使用方法

首先，需要在模板中使用 `component` 标签并绑定 `is` 属性。

```html
<template>
  <component :is="currentComponent"></component>
</template>
```

在脚本部分，根据条件动态设置 `currentComponent` 的值。

```javascript
import { ref } from 'vue';
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';

export default {
  components: {
    ComponentA,
    ComponentB,
  },
  setup() {
    const currentComponent = ref('ComponentA');

    function switchComponent() {
      currentComponent.value =
        currentComponent.value === 'ComponentA' ? 'ComponentB' : 'ComponentA';
    }

    return {
      currentComponent,
      switchComponent,
    };
  },
};
```

这样，当 `currentComponent` 的值发生变化时，渲染的组件也会相应切换。

#### 示例

```html
<template>
  <div>
    <button @click="switchComponent">Switch Component</button>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import ComponentA from './ComponentA.vue';
  import ComponentB from './ComponentB.vue';

  export default {
    components: {
      ComponentA,
      ComponentB,
    },
    setup() {
      const currentComponent = ref('ComponentA');

      function switchComponent() {
        currentComponent.value =
          currentComponent.value === 'ComponentA' ? 'ComponentB' : 'ComponentA';
      }

      return {
        currentComponent,
        switchComponent,
      };
    },
  };
</script>
```

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 `<KeepAlive>` 组件强制被切换掉的组件仍然保持“存活”的状态。

### 异步组件

异步组件是 Vue 3 中用于按需加载组件的一种方式，可以显著减少初始加载时间，提高应用性能。Vue 3 提供了 `defineAsyncComponent` 函数用于定义异步加载的组件。

#### 使用方法

定义一个异步组件：

```javascript
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => import('./MyComponent.vue'));

export default {
  components: {
    AsyncComponent,
  },
};
```

在模板中使用异步组件：

```html
<template>
  <div>
    <AsyncComponent />
  </div>
</template>
```

#### 高级用法

可以为异步组件配置加载状态、错误处理和重试逻辑：

```javascript
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),// 加载函数
  loadingComponent: LoadingComponent,// 加载异步组件时使用的组件
  delay: 200, // 展示加载组件前的延迟时间，默认为 200ms
  errorComponent: ErrorComponent,// 加载失败后展示的组件
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000, // 超时时间(ms)，超时后显示errorComponent
});

export default {
  components: {
    AsyncComponent,
  },
};
```

#### 示例

```html
<template>
  <div>
    <AsyncComponent />
  </div>
</template>

<script>
  import { defineAsyncComponent } from 'vue';
  import LoadingComponent from './LoadingComponent.vue';
  import ErrorComponent from './ErrorComponent.vue';

  const AsyncComponent = defineAsyncComponent({
    loader: () => import('./MyComponent.vue'),
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    delay: 200,
    timeout: 3000,
  });

  export default {
    components: {
      AsyncComponent,
    },
  };
</script>
```

### 总结

- **动态组件** 适用于需要根据条件动态渲染不同组件的场景。
- **异步组件** 则适用于需要按需加载组件以提高性能的场景。

通过合理使用动态组件和异步组件，可以极大地提高 Vue 应用的灵活性和性能。

#### KeepAlive组件

`<KeepAlive>` 是一个内置组件，它的功能是在多个组件间动态切换时缓存被移除的组件实例。

```javascript
<script setup>
import { shallowRef } from 'vue'
import CompA from './CompA.vue'
import CompB from './CompB.vue'

const current = shallowRef(CompA)
</script>

<template>
  <div class="demo">
    <label><input type="radio" v-model="current" :value="CompA" /> A</label>
    <label><input type="radio" v-model="current" :value="CompB" /> B</label>
    <component :is="current"></component>
  </div>
</template>
```

```javascript
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <p>Current component: A</p>
  <span>count: {{ count }}</span>
  <button @click="count++">+</button>
</template>
```

```javascript
<script setup>
import { ref } from 'vue'
const msg = ref('')
</script>

<template>
  <p>Current component: B</p>
  <span>Message is: {{ msg }}</span>
  <input v-model="msg">
</template>
```
运行上面的例子，你会看到两个有状态的组件——A 有一个计数器，而 B 有一个通过 v-model 同步 input 框输入内容的文字展示。尝试先更改一下任意一个组件的状态，然后切走，再切回来。之前已更改的状态都被重置了。

想要组件能在被“切走”的时候保留它们的状态。要解决这个问题，我们可以用 `<KeepAlive>` 内置组件将这些动态组件包装起来：

```javascript
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

### ref高级用法

#### 动态绑定 ref

需要 v3.2.25 及以上版本

可以通过 `v-for` 动态绑定多个 `ref`：

```javascript
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([1, 2, 3])

const itemRefs = ref([])

onMounted(() => {
  alert(itemRefs.value.map(i => i.textContent))
})
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

### 注意事项

1. **保证 ref 的唯一性**：在同一个作用域中，避免多个元素使用相同的 ref 名称。
2. **ref 的时效性**：你只可以**在组件挂载后**才能访问模板引用。如果你想在模板中的表达式上访问 input，在初次渲染时会是 null。这是因为在初次渲染前这个元素还不存在呢！
3. **访问子组件的公共接口**：通过 ref 访问子组件时，应避免访问子组件的私有状态或方法，只访问公开的接口。

### 适用场景

1. **直接 DOM 操作**：需要直接操作 DOM 元素时，例如手动聚焦、获取输入框的值等。
2. **访问子组件方法**：需要从父组件调用子组件的方法或访问子组件的状态时。
3. **动画和过渡效果**：需要手动控制元素的动画和过渡效果时。

通过合理使用模板引用与 ref，可以在 Vue 3 中实现更加灵活和强大的功能，使得组件间的交互和 DOM 操作更加便捷。

## Teleport 组件

`Teleport` 用于将组件渲染到 DOM 树的指定位置。

```javascript
//App.vue
<template>
  <div class="outer">
    <h3>Tooltips with Vue 3 Teleport</h3>
    <div>
      <MyModal />
    </div>
  </div>
</template>
<script setup>
import MyModal from './MyModal.vue'
</script>
```
```javascript
//MyModal.vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  border: 1px solid #000;
  text-align: center;
}
</style>
```
`Teleport` 组件使得组件内容可以脱离父组件的 DOM 层次结构，直接移动到指定的目标元素中。

这类场景最常见的例子就是全屏的模态框。理想情况下，我们希望触发模态框的按钮和模态框本身是在同一个组件中，因为它们都与组件的开关状态有关。但这意味着该模态框将与按钮一起渲染在应用 DOM 结构里很深的地方。这会导致该模态框的 CSS 布局代码很难写。
