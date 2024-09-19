---
title: 状态管理
date: 2024-06-06 11:00:00
post: comments
enable: true
categories:
  - [前端开发手册, Vue3 奇妙之旅：轻松掌握新语法]
tags:
  - vue
  - vue3
---

# 状态管理

在大型单页面应用中，管理复杂的状态变得至关重要。Vuex 是 Vue.js 的官方状态管理库，提供了集中式存储和管理应用所有组件的状态。Vuex 4 是为 Vue 3 设计的版本。本文将概述 Vuex 4，介绍 State、Getter、Mutation、Action 的使用，模块化状态管理，以及如何使用 Composition API 管理状态。

## Vuex 4 概述

Vuex 4 是一个专为 Vue 3 设计的状态管理库，它提供了一种集中式的方式来管理应用的所有状态。它的核心概念包括 State、Getter、Mutation 和 Action，这些概念帮助开发者以结构化和可维护的方式管理状态。

### 安装 Vuex

首先，安装 Vuex：

```bash
npm install vuex@next
```

### 创建 Vuex Store

在项目中创建一个 Vuex Store：

```javascript
// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    count: 0
  },
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    }
  }
});

export default store;
```

### 使用 Vuex Store

在主应用中引入并使用 Vuex Store：

```javascript
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

const app = createApp(App);
app.use(store);
app.mount('#app');
```

## State、Getter、Mutation、Action 的使用

### State

State 用于存储应用的状态数据。可以通过 `store.state` 访问状态。

```javascript
// src/store/index.js
const store = createStore({
  state: {
    count: 0
  }
});
```

在组件中访问 State：

```html
<template>
  <div>Count: {{ count }}</div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();
    const count = computed(() => store.state.count);
    return { count };
  }
};
</script>
```

### Getter

Getters 用于从 State 中派生出一些状态，可以认为是 State 的计算属性。

```javascript
// src/store/index.js
const store = createStore({
  state: {
    count: 0
  },
  getters: {
    doubleCount: state => state.count * 2
  }
});
```

在组件中访问 Getter：

```html
<template>
  <div>Double Count: {{ doubleCount }}</div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();
    const doubleCount = computed(() => store.getters.doubleCount);
    return { doubleCount };
  }
};
</script>
```

### Mutation

Mutations 用于更改 State，它是 Vuex 唯一改变状态的方法。通过 `commit` 方法来触发 Mutation。

```javascript
// src/store/index.js
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
```

在组件中提交 Mutation：

```html
<template>
  <div>
    <div>Count: {{ count }}</div>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();
    const count = computed(() => store.state.count);
    const increment = () => {
      store.commit('increment');
    };
    return { count, increment };
  }
};
</script>
```

### Action

Actions 类似于 Mutations，但它是用于处理异步操作。通过 `dispatch` 方法来触发 Action。

```javascript
// src/store/index.js
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    }
  }
});
```

在组件中分发 Action：

```html
<template>
  <div>
    <div>Count: {{ count }}</div>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();
    const count = computed(() => store.state.count);
    const incrementAsync = () => {
      store.dispatch('incrementAsync');
    };
    return { count, incrementAsync };
  }
};
</script>
```

## 模块化状态管理

当应用变得越来越复杂时，可以将 Store 拆分成模块，每个模块具有自己的 State、Getter、Mutation 和 Action。

```javascript
// src/store/modules/counter.js
const counter = {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    }
  }
};

export default counter;
```

在主 Store 中引入模块：

```javascript
// src/store/index.js
import { createStore } from 'vuex';
import counter from './modules/counter';

const store = createStore({
  modules: {
    counter
  }
});

export default store;
```

## 使用 Composition API 管理状态

```html
<template>
  <div>
    <div>Count: {{ count }}</div>
    <button @click="increment">Increment</button>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();
    const count = computed(() => store.state.count);
    const increment = () => {
      store.commit('increment');
    };
    const incrementAsync = () => {
      store.dispatch('incrementAsync');
    };
    return { count, increment, incrementAsync };
  }
};
</script>
```

## 使用 Options API 管理状态

```html
<template>
  <div>
    <div>Count: {{ count }}</div>
    <button @click="increment">Increment</button>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
// options api
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    doubleCount() {
      return this.$store.getters.doubleCount;
    },
  },
  methods: {
    increment() {
      this.$store.commit('increment');
    },
    incrementAsync() {
      this.$store.dispatch('incrementAsync');
    },
  },
}; 
```

通过以上内容，您可以在 Vue 3 中使用 Vuex 4 管理应用状态，包括 State、Getter、Mutation、Action 的使用，模块化状态管理，以及结合 Composition API 来管理状态。这将使得您的应用更具结构化、可维护性和扩展性。