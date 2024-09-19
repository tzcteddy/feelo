---
title: 第二节：页面搭建
date: 2024-06-06 10:53:00
post: comments
enable: true
categories: 
- [前端开发手册, 从零开始：手把手教你打造炫酷新页面]
tags: 
- 开发手册
---

# 第二节：页面搭建

大家好，欢迎来到第二节课。在第一节课中，我们已经完成了项目的初始化。接下来，我们将开始搭建页面。在上一节的结尾，我们明确了课程的最终目标，即完成一个检索列表页面（如下图所示）：

![](../../img/frontendGuide/actualCombat/project/x-0004.png)

页面布局上包括标题、检索表单、检索结果列表和分页器等部分，接下来我们将开始搭建页面，并完成以上目标。

## 初始化页面

### 1. 创建列表页面

在 `src` 目录下创建 `pages` 目录，并在 `pages` 目录下创建 `list.vue` 文件，作为检索列表页面的入口文件。

在`src/pages/list.vue` 文件内模版代码， 如下：

```html
  <template>
      <div>
        列表页面
      </div>
    </template>
    
  <script setup lang="ts">
  </script>

  <style scoped>
  </style>
```

### 2. 添加页面路由

#### 安装 `vue-router` 

> `vue-router` 是 `Vue`官方的客户端路由解决方案。

在项目根目录下执行以下命令，安装 `vue-router`：

```bash
pnpm install vue-router
```

![vue-router安装](../../img/frontendGuide/actualCombat/project/x-0009.png)

安装成功后package.json内依赖会同步增加vue-router项

![package.json](../../img/frontendGuide/actualCombat/project/x-0010.png)

#### 配置路由

a. 在 `src` 目录下创建 `router` 目录，并在 `router` 目录下创建 `index.ts` 文件，作为路由配置文件。

 `src/router/index.ts` 文件中添加list页面路由（PS：之后新增页面访问路由在此文件添加即可）：

```ts
//src/router/index.ts 
import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'

// 定义路由（路由懒加载组件）
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', redirect: '/list' }, // 根路径重定向到/list页面
  {
    path: '/list', // 页面路径
    name: 'List',
    component: () => import('../pages/list.vue'), // 页面组件
  },
]

// 创建路由的实例对象
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 向外共享路由的实例对象
export default router
```

b. 在 `src/main.ts` 入口文件中引入路由配置

```ts
// src/main.ts
...

import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

![src/main.ts](../../img/frontendGuide/actualCombat/project/x-0011.png)

c. 修改 `src/app.vue` 文件代码，加入 `RotuerView`组件，用来渲染路由组件。

```html
  <template>
    <router-view />
  </template>
  <script setup lang="ts"></script>
```

d. 修改 `src/style.css` 文件代码，重置元素默认样式。

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
```

至此我们初始化页面已经基本完成，浏览器打开 http://localhost:3000/list 即可看到我们新添加的检索列表页。

![](../../img/frontendGuide/actualCombat/project/x-0012.png)

## 使用基础组件库
一般组件库 为 `Web应用` 提供了丰富的基础 UI 组件，如 `Element Plus`、`Ant Design Vue` 等，能够提高开发效率和保持项目风格一致性，本节我们使用 `Ant Design Vue` 组件库进行示范。相关组件细节和API可到 [Ant Design Vue官网](https://antdv.com/docs/vue/introduce-cn) 查看。

a. 安装 `Ant Design Vue` 组件库

```bash
pnpm install ant-design-vue@4.x
```

![](../../img/frontendGuide/actualCombat/project/x-0013.png)

安装成功后package.json内依赖会同步增加ant-design-vue项

![package.json](../../img/frontendGuide/actualCombat/project/x-0014.png)


b. 在 `src/main.ts` 入口文件中引入 `Ant Design Vue` 组件库

```ts
// src/main.ts
// 全局完整注册
...

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

createApp(App)
  .use(router)
  .use(Antd)
  .mount('#app')
```

c. 在 `src/pages/list.vue` 中使用 `Ant Design Vue` 组件库

增加 `a-button`按钮组件代码， 测试`Ant Design Vue`是否已成功全局注册

```html
<template>
    <div>
      列表页面
      <a-button type="primary">Primary Button</a-button>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  </style>
```

浏览器打开 http://localhost:3000/list 在检索列表页，看到页面上有了一枚蓝色按钮，恭喜你 `Ant Design Vue` 组件库可以正常使用了。

![](../../img/frontendGuide/actualCombat/project/x-0015.png)

d. 设置全局国际化配置为中文

`Ant Design Vue` 目前的默认文案是英文, 我们为了应用到中文系统开发中需要使用 [LocaleProvider](https://antdv.com/docs/vue/i18n-cn/#LocaleProvider) 方案设置全局国际化配置为中文。

`Ant Design Vue` 提供了一个 Vue 组件 ConfigProvider 用于全局配置国际化文案。ConfigProvider 不包含时间类组件的国际化，你需要额外引入时间库(dayjs、momentjs、date-fns 等)的国际化文件，以下我们以 `dayjs` 为例。

这里涉及到使用 `dayjs` 作为日期处理工具库，然而我们项目现在还未添加过此库的依赖，所以我们现在先安装下 `dayjs` 

```bash
  # 安装dayjs
  pnpm install dayjs
```

`dayjs` 成功安装完成后，我们就可以在`src/app.vue`内加入如下国际化配置代码了， 这样后续我们使用`Ant Design Vue`（含时间类组件）就能正常按照中文文案和格式展示了。

```html
  <template>
    <a-config-provider :locale="zhCN">
        <router-view />
    </a-config-provider>
  </template>
  <script setup lang="ts">
    import zhCN from 'ant-design-vue/es/locale/zh_CN'
    import dayjs from 'dayjs'
    import 'dayjs/locale/zh-cn'
    dayjs.locale('zh-cn');
  </script>
```


## 使用less替代css
> Less是一种由Alexis Sellier设计的动态层叠样式表语言, Less 扩充了CSS 语言，增加了诸如变量、混合（mixin）、运算、函数等功能。 Less 既可以运行在服务器端（Node.js 和Rhino 平台）也可以运行在客户端（浏览器）。

安装 `less`

```bash
pnpm install -D less
```

## 检索列表页面编写
进行到现在，我们的准备工作就完成了，接下来就开始进行页面的功能编写了。
想要实现的检索列表页面，主要包含标题、检索表单和结果分页列表三部分，下边我们将按照这三部分逐步进行。 

### 标题模块编写
我们拆解下标题模块功能, 其包含的部分比较简单，主要包含标题文案展示和可控折叠下侧包裹的检索表单。

首先去先前引用的`Ant Design Vue`文档查找相关的组件，发现`a-collapse`组件可以满足我们的需求，具体使用方式可以参考[Ant Design Vue Collapse](https://www.antdv.com/components/collapse-cn/)。


a. 按照组件库代码示例，在 `src/pages/list.vue` 中添加标题模块代码，增加必要的标题文案，如下：
```html
<template>
  <div>
    <a-collapse>
      <a-collapse-panel key="1" header="合同检索列表">
        <p>检索表单内容展位</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
```
访问 http://localhost:3000/list ， 查看展示如下，检查基础折叠功能和标题展示正常，不过也预期有差距，我们接下来进行相关属性配置和调整。

![](../../img/frontendGuide/actualCombat/project/x-0016.png)


b. 根据预期效果，我们需要调整下属性和折叠样式，修改 `src/pages/list.vue` 代码如下：

主要增加以下调整：
+ 设置当前折叠为展开 `const activeKey = ref(['1'])`
+ 开启ghost属性，去掉现有边框和背景色样式
+ 定制化重置折叠collapse组件部分样式 

```html
<template>
  <div class="search-list">
    <!-- 折叠标题-包裹检索表单 -->
    <a-collapse
      v-model:activeKey="activeKey"
      :ghost="true">
      <a-collapse-panel
        key="1"
        header="合同检索列表"
      >
        <p>检索表单占位内容</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 设置当前折叠为展开
const activeKey = ref(['1'])

</script>

<style scoped lang="less">
  /** 定制化重置折叠collapse组件部分样式 
    * :deep用于穿透当前页面样式作用域（scoped），覆盖引用基础组件默认样式
  */
  
  :deep(.ant-collapse-item) {
    .ant-collapse-header{
      font-weight: bold;
      font-size: 16px;
      padding: 10px 15px !important;
      background-color: #f2f2f2;
      border-radius: 0 !important;
    }
  }
</style>
```

调整完，再访问 http://localhost:3000/list ，查看展示如下，现在已完成标题模块编写
![](../../img/frontendGuide/actualCombat/project/x-0017.png)


### 检索表单编写

我接下来们开始检索表单的编写，首先我们拆解下模块功能如下：

![检索表单模块效果图](../../img/frontendGuide/actualCombat/project/x-0019.png)

![检索表单模块功能](../../img/frontendGuide/actualCombat/project/x-0018.png)

#### 布局
我们将要实现的检索表单是我们日常常见的表单功能，首先想到的是先实现此种布局，在`Ant Design Vue`提供了 [24等分的栅格化系统](https://antdv.com/components/grid-cn)，基于行（row）和列（col）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来。所以我们采用`Row`和`Col`组件实现检索表单布局如下：

```html
  <template>
    <a-row :gutter="[20, 10]">
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">col-8</div>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">col-8</div>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">col-8</div>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">col-8</div>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <div class="gutter-box">col-8</div>
      </a-col>
      <a-col class="gutter-row" :span="24">
        <div class="gutter-box">col-24</div>
      </a-col>
    </a-row>
    <a-row justify="center" style="margin-top: 15px">
      <a-button type="primary">查询</a-button>
      <a-button style="margin-left: 15px">重置</a-button>
    </a-row>
  </template>

  <style scoped>
  .gutter-box {
    background: #0092ff;
    padding: 8px 0;
  }
  </style>
```

![概念布局](../../img/frontendGuide/actualCombat/project/x-0020.png)

#### 表单
主要的表单内容部分使用 [Form组件](https://antdv.com/components/form-cn)实现，各个表单项使用嵌套子组件 `FormItem` 实现。

```html
<template>
  ...
  <a-form
        ref="formRef"
        :model="formData">
        <a-row
          :gutter="[50, 20]">
          <a-col :span="8">
            <a-form-item
              label="合同场景"
              name="contractScene">
              合同场景占位
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同编号"
              name="contractNo">
              合同编号占位
            </a-form-item>
          </a-col>
          ...
        </a-row>
        ...
  </a-form>  
  ...
</template>  
<script setup lang="ts">
  import { ref } from 'vue';
  import{ Form }from "ant-design-vue"

  ...

  // 表单数据类型定义
  interface FormData {
    contractScene: number | null
    auditStatus: string[]
    contractNo: string
    contractType: string
    trackingPeopleName: string
    ownerName: string
    contractDate: string[]
  }

  // 表单数据
  const formData = ref<FormData>({
    contractScene: null,
    auditStatus: [],
    contractNo: '',
    contractType: '',
    trackingPeopleName: '',
    ownerName: '',
    contractDate: []
  })

  // 表单组件实例
  const formRef = ref<typeof Form | null>(null)

  ...

</script>
```

##### 表单项 - 合同场景和跟单人 （select组件）

```html
  <template>
    ...
    <a-form-item
      label="跟单人"
      name="trackingPeopleName">
      <!-- 
          v-model:value 绑定数据值到formData.trackingPeopleName
          options下拉项数据设置为users
          field-names设置数据源和选择内容数据key值映射 {label: 'userName', value: 'userName'}
          show-search 可搜索
          allow-clear 允许展示清空ICON按钮
        -->
      <a-select
        class="full-width"
        v-model:value="formData.trackingPeopleName"
        placeholder="请选择跟单人"
        :options="users"
        :field-names="{label: 'userName', value: 'userName'}"
        :show-search="true"
        :allow-clear="true"
      ></a-select>
    </a-form-item>
    ...
    <a-form-item
      label="合同场景"
      name="contractScene">
       <!-- 
          v-model:value 绑定数据值到formData.contractScene
          options下拉项数据设置为contractSceneOptions
        -->
      <a-select
        class="full-width"
        v-model:value="formData.contractScene"
        :options="contractSceneOptions"
        placeholder="请选择合同场景"
      ></a-select>
    </a-form-item>
    ...
  </template>
  <script setup lang="ts">
    ...
      // 合同场景筛选项枚举
      const contractSceneOptions = [
        {
          value: null,
          label: '全部',
        },
        {
          value: 1,
          label: '线上',
        },
        {
          value: '',
          label: 'APP',
        },
        {
          value: '',
          label: '电签',
        }
      ]

      const users = [{
        userName: '章三',
        userId: 10001
      },
      {
        userName: '里斯',
        userId: 10002
      },
      {
        userName: '王五',
        userId: 10002
      }]

    ...
  </script>
  <style scoped lang="less">
    /** 
      * 用于设置select或者range-picker等组件继承父元素宽度
     */
    .full-width {
      width: 100% !important;
    }
    ...
  </style>
```

##### 表单项 - 合同编号和业主姓名 （input组件）

```html
 <template>
    ...
    <a-form-item
      label="合同编号"
      name="contractNo">
      <!-- 
          v-model:value 绑定数据值到formData.contractNo
        -->
      <a-input
        v-model:value="formData.contractNo"
        placeholder="请输入合同编号"/>
    </a-form-item>
    ...
    <a-form-item
      label="业主姓名"
      name="ownerName">
      <!-- 
          v-model:value 绑定数据值到formData.ownerName
      -->
      <a-input
        v-model:value="formData.ownerName"
        placeholder="请输入业主姓名" />
    </a-form-item>
    ...
  </template>
```

##### 表单项 - 合同录入日期 （range-picker组件）
```html
 <template>
    ...
    <a-form-item
      label="合同录入日期"
      name="contractDate">
      <!-- 
          v-model:value 绑定数据值到formData.contractDate
          valueFormat 日选择结果格式
        -->
      <a-range-picker
        class="full-width"
        v-model:value="formData.contractDate"
        valueFormat="YYYY-MM-DD"
        :placeholder="['开始日期', '结束日期']" />
    </a-form-item>
    ...
  </template>
```

##### 表单项 - 合同状态 （checkbox组件）
```html
 <template>
    ...
    <!-- 
        v-model:value 绑定数据值到formData.auditStatus
        options 复选框数据设置为auditStatusOptions
      -->
    <a-form-item
      label="合同状态"
      name="auditStatus">
      <a-checkbox-group
        v-model:value="formData.auditStatus"
        name="checkboxgroup"
        :options="auditStatusOptions" />
    </a-form-item>
    ...
  </template>
    <script setup lang="ts">
    ...
    const auditStatusOptions = [
      {
        value: '23',
        label: '录入中',
      },
      {
        value: '24',
        label: '已录入',
      },
      {
        value: '22',
        label: '折扣已提交',
      },
      {
        value: '6',
        label: '合同已打印',
      },
      {
        value: '20',
        label: '草签作废',
      },
      {
        value: '96',
        label: '已签字',
      },
    ]
    ...
  </script>
```

##### 查询和重置
```html
 <template>
    ...
    <!-- 
        v-model:value 绑定数据值到formData.auditStatus
        options 复选框数据设置为auditStatusOptions
      -->
    <a-row
      justify="center">
      <a-button type="primary" @click="handleSerch">查询</a-button>
      <a-button  style="margin-left: 10px" @click="handleReset">重置</a-button>
    </a-row>
    ...
  </template>
    <script setup lang="ts">
    import { ref } from 'vue';
    import{ Form }from "ant-design-vue"
    
    ...
    
    // 表单组件实例
    const formRef = ref<typeof Form | null>(null)

    /**
     * handleSerch
     * @description 查询数据
     */
    const handleSerch = () => {
      console.log("🚀 ~ handleSerch ~ formData.value:", formData.value)
    }

    /**
     * handleReset
     * @description 重置查询
     */
    const handleReset = () => {
      if (formRef.value) {
        // 调用Form组件实例提供的resetFields方法重置表单项到默认值
        formRef.value.resetFields()
        handleSerch()
      }
    }

    ...
  </script>
```

调试查询和重置功能正常，如下图：

![](../../img/frontendGuide/actualCombat/project/x-0021.png)


到现在检索表单项功能基本实现完成，完整代码如下：

```html
  <template>
  <div class="search-list">
    <!-- 折叠标题-包裹检索表单 -->
    <a-collapse
      v-model:activeKey="activeKey"
      :ghost="true">
      <a-collapse-panel
        key="1"
        header="合同检索列表"
      >
      <a-form
        ref="formRef"
        :model="formData">
        <a-row
          :gutter="[50, 20]">
          <a-col :span="8">
            <a-form-item
              label="合同场景"
              name="contractScene">
              <a-select
                class="full-width"
                v-model:value="formData.contractScene"
                :options="contractSceneOptions"
                placeholder="请选择合同场景"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同编号"
              name="contractNo">
              <a-input
                v-model:value="formData.contractNo"
                placeholder="请输入合同编号"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="合同录入日期"
              name="contractDate">
              <a-range-picker
                class="full-width"
                v-model:value="formData.contractDate"
                valueFormat="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="业主姓名"
              name="ownerName">
              <a-input
                v-model:value="formData.ownerName"
                placeholder="请输入业主姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="跟单人"
              name="trackingPeopleName">
              <a-select
                class="full-width"
                v-model:value="formData.trackingPeopleName"
                placeholder="请选择跟单人"
                :options="users"
                :field-names="{label: 'userName', value: 'userName'}"
                :show-search="true"
                :allow-clear="true"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="合同状态"
              name="auditStatus">
              <a-checkbox-group
                v-model:value="formData.auditStatus"
                name="checkboxgroup"
                :options="auditStatusOptions" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row
          justify="center">
          <a-button type="primary" @click="handleSerch">查询</a-button>
          <a-button  style="margin-left: 10px" @click="handleReset">重置</a-button>
        </a-row>
      </a-form>
    </a-collapse-panel>
  </a-collapse>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import{ Form }from "ant-design-vue"

// 设置当前折叠为展开
const activeKey = ref(['1'])


const contractSceneOptions = [
  {
    value: null,
    label: '全部',
  },
  {
    value: 1,
    label: '线上',
  },
  {
    value: '',
    label: 'APP',
  },
  {
    value: '',
    label: '电签',
  }
]

const auditStatusOptions = [
  {
    value: '23',
    label: '录入中',
  },
  {
    value: '24',
    label: '已录入',
  },
  {
    value: '22',
    label: '折扣已提交',
  },
  {
    value: '6',
    label: '合同已打印',
  },
  {
    value: '20',
    label: '草签作废',
  },
  {
    value: '96',
    label: '已签字',
  },
]

const users = [{
  userName: '章三',
  userId: 10001
},
{
  userName: '里斯',
  userId: 10002
},
{
  userName: '王五',
  userId: 10002
}]

// 表单数据类型定义
interface FormData {
  contractScene: number | null
  auditStatus: string[]
  contractNo: string
  contractType: string
  trackingPeopleName: string
  ownerName: string
  contractDate: string[]
}

// 表单数据
const formData = ref<FormData>({
  contractScene: null,
  auditStatus: [],
  contractNo: '',
  contractType: '',
  trackingPeopleName: '',
  ownerName: '',
  contractDate: []
})

// 表单组件实例
const formRef = ref<typeof Form | null>(null)

/**
 * handleSerch
 * @description 查询数据
 */
const handleSerch = () => {
  console.log("🚀 ~ handleSerch ~ formData.value:", formData.value)
}

/**
 * handleReset
 * @description 重置查询
 */
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    handleSerch()
  }
}

</script>

<style scoped lang="less">
  .full-width {
    width: 100% !important;
  }
  /** 定制化重置折叠collapse组件部分样式 
    * :deep用于穿透当前页面样式作用域（scoped），覆盖引用基础组件默认样式
  */
  :deep(.ant-collapse-item) {
    .ant-collapse-header{
      font-weight: bold;
      font-size: 16px;
      padding: 10px 15px !important;
      background-color: #f2f2f2;
      border-radius: 0 !important;
    }
  }
</style>
```

### 结果分页列表编写
接下来我们继续，开始编写结果分页列表内容, 首先添加基础表格代码：

#### 基础表格

```html
<template>
  ...
  <a-table
    :columns="columns"
    :data-source="listData"></a-table>
  ...
</template>
<script setup lang="ts">
  ...
import type { TableColumnsType } from 'ant-design-vue';

// 结果列表列配置
const columns:TableColumnsType = [
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    width: 200,
  },
  {
    title: '合同场景',
    dataIndex: 'isContractBlank',
    width: 150,
  },
  {
    title: '合同录入日期',
    dataIndex: 'crtDttmFormate',
  },
  {
    title: '业主姓名',
    dataIndex: 'ownerName',
  },
  {
    title: '跟单人',
    dataIndex: 'trackingPeopleName',
  },
  {
    title: '合同状态',
    dataIndex: 'auditStatusName',
  },
  {
    title: '操作',
    key: 'action',
  },
]

interface ContractData {
  isContractBlank: number | null
  auditStatus: string
  auditStatusName: string
  conId: number
  contractNo: string
  trackingPeopleName: string
  ownerName: string
  crtDttmFormate: string
}

// 合同MOCK源数据
// 合同MOCK源数据
const contractList: ContractData[] = [
  {
    auditStatus: '24',
    auditStatusName: '已录入',
    isContractBlank: 1,
    conId: 501042270,
    contractNo: 'JZL202407240004WA',
    trackingPeopleName: '章三',
    ownerName: '的需1',
    crtDttmFormate: '2024-07-24 14:26:43',
  },
  {
    auditStatus: '24',
    auditStatusName: '已录入',
    isContractBlank: 3,
    conId: 501042271,
    contractNo: 'JZL202407240005WA',
    trackingPeopleName: '章三',
    ownerName: '的需2',
    crtDttmFormate: '2024-07-10 10:16:40',
  },
  {
    auditStatus: '6',
    auditStatusName: '合同已打印',
    isContractBlank: 2,
    conId: 501042272,
    contractNo: 'JZL202407240006WA',
    trackingPeopleName: '章三',
    ownerName: '的需3',
    crtDttmFormate: '2024-07-05 23:22:43',
  },
  {
    auditStatus: '6',
    auditStatusName: '合同已打印',
    isContractBlank: 1,
    conId: 501042273,
    contractNo: 'JZL20240724007WA',
    trackingPeopleName: '里斯',
    ownerName: '的需4',
    crtDttmFormate: '2024-07-24 18:23:03',
  },
  {
    auditStatus: '96',
    auditStatusName: '已签字',
    isContractBlank: 1,
    conId: 501042274,
    contractNo: 'JZL202407240008WA',
    trackingPeopleName: '王五',
    ownerName: '的需',
    crtDttmFormate: '2024-07-25 19:26:46',
  },
  {
    auditStatus: '96',
    auditStatusName: '已签字',
    isContractBlank: 1,
    conId: 501042275,
    contractNo: 'JZL202407240009WA',
    trackingPeopleName: '王五',
    ownerName: '的需5',
    crtDttmFormate: '2024-07-25 04:12:56',
  },
  {
    auditStatus: '96',
    auditStatusName: '已签字',
    isContractBlank: 1,
    conId: 501042276,
    contractNo: 'JZL202407240010WA',
    trackingPeopleName: '里斯',
    ownerName: '的需6',
    crtDttmFormate: '2024-07-24 20:22:49',
  },
  {
    auditStatus: '96',
    auditStatusName: '已签字',
    isContractBlank: 3,
    conId: 501042275,
    contractNo: 'JZL202407240009WA',
    trackingPeopleName: '王五',
    ownerName: '的需7',
    crtDttmFormate: '2024-07-24 13:25:22',
  },
  {
    auditStatus: '20',
    auditStatusName: '合同作废',
    isContractBlank: 1,
    conId: 501042276,
    contractNo: 'JZL202407240011WA',
    trackingPeopleName: '里斯',
    ownerName: '的需8',
    crtDttmFormate: '2024-07-26 12:26:00',
  },
]

// 列表数据
const listData = ref(contractList)

  ...
</script>
```

![基本表格访问效果](../../img/frontendGuide/actualCombat/project/x-0022.png)

#### 设置分页

接下来设置表格的分页器，由于现在使用的是MOCK数据，所以最终实现前端分页功能。

```html
<template>
  ...
  <a-table
    :columns="columns"
    :data-source="listData"
    :pagination="pagination"
    @change="handleTableChange" ></a-table>
  ...
</template>
<script setup lang="ts">
...
import type { TableColumnsType, TableProps } from 'ant-design-vue';
import { ref, computed } from 'vue';

...

// 列表分页默认值
enum PAGINATION_DEFAULT  {
  PAGE = 1,
  PAGE_SIZE = 5,
}

const current = ref(PAGINATION_DEFAULT.PAGE)
const pageSize = ref(PAGINATION_DEFAULT.PAGE_SIZE)

// 列表分页配置
const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  total: listData.value.length,
  showQuickJumper: true,
  showSizeChanger: true,
  showTitle: true,
  pageSizeOptions: [5, 10, 20, 50],
  showTotal: (total: number) => `共 ${total} 条`,
}))

/**
 * handleTableChange
 * @description 表格变动回调函数
 * @param {} pag 分页数据
 */
const handleTableChange:TableProps['onChange'] = (pag) => {
  current.value = pag.current || PAGINATION_DEFAULT.PAGE
  pageSize.value = pag.pageSize || PAGINATION_DEFAULT.PAGE_SIZE
}
...
</script>
```

![分页器访问效果](../../img/frontendGuide/actualCombat/project/x-0023.png)

#### 增加表格列自定义渲染

我们主要进行了以下改进：
+ 合同编号列：渲染为超链接样式并支持跳转功能。
+ 合同场景列：将枚举值转换为名称展示。
+ 操作列：实现了详情按钮和删除按钮的功能。

```html
  <template>
  ...
  <a-table
    :columns="columns"
    :data-source="listData"
    :pagination="pagination"
    @change="handleTableChange" >
    <template #bodyCell="{ column, record, text, index }">
      <template v-if="column.dataIndex === 'contractNo'">
        <a @click="handleJumpDetail(record)">{{ text }}</a>
      </template>
      <template v-if="column.dataIndex === 'isContractBlank'">
        <span>{{ convertSceneName(text) }}</span>
      </template>
      <template v-if="column.key === 'action'">
        <a-space>
          <a-button
            type="primary"
            size="small"
            ghost
            @click="handleJumpDetail(record)">详情</a-button>
          <a-button
            type="primary"
            size="small"
            danger
            ghost
            @click="handleDelete(index)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  ...
  </template>
  <script setup lang="ts">
    import { ref, computed } from 'vue';
    import type { TableColumnsType, TableProps } from 'ant-design-vue';
    import{ Form, message, Modal }from "ant-design-vue"
    ...

    /**
     * convertSceneName
     * @description 合同场景名称转换
     * @param code 合同场景编码
     */
    const convertSceneName = (code: number) => {
      return contractSceneOptions.find(item => item.value === code)?.label || ''
    }

    /**
     * handleJumpDetail
     * @description 跳转详情页
     * @param record 当前行数据
     */
    const handleJumpDetail = (record: ContractData) => {
      window.open(`https://uat-beijing.cbs.bacic5i5j.com/sign/sign-new/lease-sign-detail.htm?conid=${record.conId}`)
    }

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
          listData.value.splice(index + (current.value - 1) * pageSize.value, 1)
          message.success('删除成功！')
        }
      })
    }
  </script>
...
```

![自定义渲染列访问效果](../../img/frontendGuide/actualCombat/project/x-0024.png)


#### 实现与检索表单联动的查询功能（纯前端模拟实现）

```html
<script setup lang="ts">
  ...
  /**
   * handleSerch
   * @description 查询数据
   */
  const handleSerch = () => {
    const { contractNo, contractScene, contractDate: [startDate='', endDate=''], ownerName, trackingPeopleName, auditStatus } = formData.value 

    listData.value = contractList.filter(item => 
      item.contractNo.includes(contractNo) 
      && (contractScene === null || item.isContractBlank === contractScene)
      && ((startDate === '' || dayjs(startDate).startOf('date').valueOf() <= dayjs(item.crtDttmFormate).valueOf()) && (endDate === '' || dayjs(endDate).endOf('date').valueOf() >= dayjs(item.crtDttmFormate).valueOf()))
      && item.ownerName.includes(ownerName)
      && (trackingPeopleName === '' || item.trackingPeopleName === trackingPeopleName)
      && (!auditStatus.length || auditStatus.includes(item.auditStatus))
      )
  }

  /**
   * handleReset
   * @description 重置查询
   */
  const handleReset = () => {
    if (formRef.value) {
      formRef.value.resetFields()
      handleSerch()
    }
  }
</script>
```

## 结语
本节我们主要学习了如何使用 `Vue` 创建页面、配置路由，以及使用 `Ant Design Vue` 组件库。通过这些知识，我们完成了一个纯前端实现的检索列表页面。在日常开发中，前端页面与后端的交互是数据展示和数据流转的关键环节。下一节我们将深入探讨如何调用接口，实现前后端的完整联通，从而使我们在本节完成的页面功能更加完善。本节完整源码可在 [gitlab](http://gitlab.it.5i5j.com/fex/my-vue-app/tree/leason-02) 查看。
