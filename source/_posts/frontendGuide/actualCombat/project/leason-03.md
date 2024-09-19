
---
title: 第三节：接口调用
date: 2024-06-06 10:52:00
post: comments
enable: true
categories: 
- [前端开发手册, 从零开始：手把手教你打造炫酷新页面]
tags: 
- 开发手册
---

# 第三节：接口调用

欢迎回来！在上一节课中，我们基本完成了检索列表页面的数据检索与展示功能。目前，我们的数据获取和处理都是在前端完成的，这显然无法满足日常业务需求。因此，接下来的任务是将页面的数据与后端接口贯通，实现前后端数据的实时交互。

## Axios 安装与使用

首先，我们在`vue`项目调用接口一般用 `Axios` 库实现，详细API可在[官网](https://www.axios-http.cn/docs/intro)查看。

Axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js，在浏览端中使用 XMLHttpRequests实现。它支持多种请求方式，如 GET、POST、PUT、DELETE 等，并且可以处理各种类型的请求和响应数据。

### 安装

在项目中安装 Axios：

```bash
pnpm install axios
```

![](../../img/frontendGuide/actualCombat/project/x-0025.png)

### 使用

在 Vue 组件中使用时，如下方式引入 Axios 即可：

```javascript
import axios from 'axios'
```

然后在`src/pages/list.vue`文件内增加如下代码，发送一个 `GET` 请求测试：

```html
<script setup lang='ts'>
import axios from 'axios'

axios.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => {
    console.log("🚀 ~ response:", response)
  })
  .catch(error => {
    console.log("🚀 ~ error:", error)
  })
</script>
```

然后浏览器访问项目，看到一条GET请求发送并返回了数据， 我们的`axios`可以正常使用了

![页面请求](../../img/frontendGuide/actualCombat/project/x-0026.png)

![同时控制台打印数据](../../img/frontendGuide/actualCombat/project/x-0027.png)


## 检索列表的接口改造

回到主线任务，继续改造检索列表，把之前mock的前端数据和逻辑用axios实现。

### 检索项【跟单人】的远程搜索

上节实现的检索表单里，我们仔细想一下，跟单人这类业务需求中搜索选择经纪人的功能，是不可能前端mock数据的，人员信息千千万想想就可怕。一般当用户输入经纪人名称时，需要根据输入的名称去远程搜索经纪人，然后展示给用户选择。

跟单人表单项调整代码如下，支持远程接口查询。

```html
<template>
    ...
    <a-form-item
        label="跟单人"
        name="trackingPeopleName">
        <a-select
        class="full-width"
        v-model:value="formData.trackingPeopleName"
        :default-active-first-option="false"
        placeholder="请选择跟单人"
        :options="users"
        :filter-option="false"
        :not-found-content="userFetching ? undefined : null"
        :field-names="{label: 'userName', value: 'userName'}"
        show-search
        :allow-clear="true"
        @search="handleUserSearch">
            <template v-if="userFetching" #notFoundContent>
            <a-spin size="small" />
        </template>
            </a-select>
    </a-form-item>
    ...
</template>
<script setup lange='ts'>
    ...

    const users = ref([])
    const userFetching = ref(false)

    /**
     * handleUserSearch
     * @description 检索人员
     * @param queryName 查询名字
     */
    const handleUserSearch = (queryName: string) => {
        if (!queryName) {
            return
        }
        users.value = []
        userFetching.value = true
        axios.get('https://sign2mock.usemock.com/users', {
            params: {
            userName: queryName
            }
        }).then(res => {
            userFetching.value = false
            if (res?.data.code === 0) {
            users.value = res?.data.data || []
            } else {
            message.error(res?.data.msg || '请求失败')
            }
            
        }).catch(() => {
            userFetching.value = false
        })
    }

    ...
</script>
```

现在人员可以正常远程检索了，但是发现有一个问题就是输入键入一个值就会立即调用一次，太频繁了。我们希望尽量在用户连续输入完成后才去调用查询接口，减少非必要的请求开销。
这里我们使用 [lodash](https://www.lodashjs.com/) 函数库的 `debounce` 防抖函数处理一下。

#### 更进一步-防抖

安装lodash
```bash
pnpm install lodash-es
```

安装类型定义
```bash
pnpm install -D  @types/lodash-es
```

#### 修改代码
```html
<script setup lange='ts'>
...
import { debounce } from "lodash-es"
...
/**
 * handleUserSearch
 * @description 检索人员
 * @param queryName 查询名字
 */
const handleUserSearch = debounce((queryName: string) => {
  if (!queryName) {
    return
  }
  users.value = []
  userFetching.value = true
  axios.get('https://sign2mock.usemock.com/users', {
    params: {
      userName: queryName
    }
  }).then(res => {
    userFetching.value = false
    if (res?.data.code === 0) {
      users.value = res?.data.data || []
    } else {
      message.error(res?.data.msg || '请求失败')
    }
    
  }).catch(() => {
    userFetching.value = false
  })
}, 300)
...
</script>
```
![连续输入123456请求一次](../../img/frontendGuide/actualCombat/project/x-0028.png)

### 改造列表查询

此后使用基于Node服务的一套列表相关接口进行演示，为解决本地开发跨域问题，设置vite开发服务器代理配置。
#### vite代理配置
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // vue3 本地项目启动端口号设置
    proxy: {
      "/api": {
        target: "http://122.51.19.40:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  }
})
```

#### 修改代码

```html
<script setup lange='ts'>
...
/**
 * handleSerch
 * @description 查询数据
 */
 const handleSerch = (page?: number) => {
  current.value = page ?? current.value
  const { contractNo, contractScene, contractDate: [startDate='', endDate=''], ownerName, trackingPeopleName, contractStatus } = formData.value 
  searchLoading.value = true
  axios.get('/api/contracts', {
    params: {
      contractNo,
      contractScene,
      startDate,
      endDate,
      ownerName,
      trackingPeopleName,
      contractStatus,
      limit: pageSize.value,
      page: current.value
    }
  }).then(res => {
    listData.value = res?.data?.contracts || []
    total.value = res?.data?.totalCount
    searchLoading.value = false
  }).catch(() => {
    message.error('请求失败')
    searchLoading.value = false
  })  
}
...
</script>
```



### 实现数据行删除

#### 修改代码
```html
<script setup lange='ts'>
...
/**
 * handleDelete
 * @description 删除当前行
 * @param index 当前行当前分页索引
 */
const handleDelete = (index: number) => {
  Modal.confirm({
    title: '提示',
    content: '确认删除当前行数据吗？',
    okText: '确认',
    cancelText: '取消',
    centered: true,
    onOk() {
      axios.post('/api/contracts/delete', {
       id: record.contractId,
      }).then(() => {
        message.success('删除成功！')
        handleSerch()
      }).catch(() => {
        message.error('请求失败')
      })  
    }
  })
}
...
</scrip>
```

![基本演示](../../img/frontendGuide/actualCombat/project/x-0029.gif)

## 结语

在本节中，我们完成了 Axios 的安装与配置，并通过实际操作展示了如何使用 Axios 进行列表数据的查询和删除操作。我们成功地将前端页面的数据与后端接口贯通，实现了基本的数据交互功能。这使得我们的检索列表页面能够实时展示后端的数据，并提供了删除功能，提升了应用的实用性和互动性。

下一节中，我们将进一步完善我们的项目，在组件封装的基础上实现新增、编辑和详情功能。通过这些操作，用户将能够更全面地管理和操作数据，使我们的应用更加完善和功能丰富。敬请期待！