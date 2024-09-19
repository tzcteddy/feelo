
---
title: 第四节：组件封装
date: 2024-06-06 10:51:00
post: comme
enable: true
categories: 
- [前端开发手册, 从零开始：手把手教你打造炫酷新页面]
tags: 
- 开发手册
---

# 第四节：组件封装

上一节中，我们使用 Axios 实现了检索列表页面中的查询和删除功能，使得前端页面能够与后端接口进行数据交互。接下来，我们将继续完善项目，增加详情、新增和编辑页面的功能。通过这些功能，用户将能够更全面地管理和操作数据，提升应用的实用性和用户体验。我们最终实现的页面效果如下：

![列表页](../../img/frontendGuide/actualCombat/project/x-0030.png)
![新增页](../../img/frontendGuide/actualCombat/project/x-0031.png)
![详情页](../../img/frontendGuide/actualCombat/project/x-0032.png)
![编辑页](../../img/frontendGuide/actualCombat/project/x-0033.png)

## 添加详情、新增和编辑页面

### 新增页面`Vue`文件

观察上边我们要实现的这三个页面的效果，我们发现，这三个页面中，新增页面和编辑页面中的表单部分和操作功能（保存、返回）是基本一致的，中间实现只涉及新增与编辑接口地址不一致的区别，所以新增和编辑页面可以共用一个`Vue`文件，在`src/router/index.ts`中定义不同的路由地址即可。针对详情页面单独增加一个`Vue`文件，对应添加详情页的访问路由配置。

#### a.新建页面`Vue`文件

在`src/pages`目录下新增`detail.vue`和`edit.vue`文件

#### b.配置访问路由

在`src/router/index.ts`文件内修改代码如下：
因为详情页和编辑需要一个合同ID，以供获取详情数据回显，所以在路由上配置命名为`id`的`params`参数。

```ts
    import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'

    // 定义路由（路由懒加载组件）
    const routes: RouteRecordRaw[] = [
        { path: '/', name: 'Home', redirect: '/list' }, // 根路径重定向到/list页面
        {
            path: '/list',
            name: 'List',
            component: () => import('../pages/list.vue'),
        },
        {
            path: '/detail/:id',
            name: 'Detail',
            component: () => import('../pages/detail.vue'),
        },
        {
            path: '/edit/:id',
            name: 'Edit',
            component: () => import('../pages/edit.vue'),
        },
        {
            path: '/create',
            name: 'Create',
            component: () => import('../pages/edit.vue'),
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

### 抽离合同信息表单组件
观察上边我们要实现的这三个页面的效果, 发现他们有一个共同的合同信息表单,所以我们可以抽离出来一个合同信息表单组件,在三个页面中引用,这样代码复用性更高,也方便维护。

在`src/components`目录下创建一个`ContractInfo.vue`文件,代码如下:

组件提供两个可供传入的属性值：
+ contractId 合同ID 页面根据是否传入contractId属性值，若有则调用详情接口获取数据回显表单
+ readonly 是都只读 页面根据传入readonly值做页面表单不可编辑限制

组件提供一个可供外侧通过引入组件实例访问的方法：
+ getFormData 校验表单结果，当表单数据校验通过后返回当前表单数据供外侧使用。

```html
<template>
    <a-form
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :model="formData">
            <a-form-item
              label="合同场景"
              name="contractScene"
              :rules="[{ required: true, message: '请选择合同场景!' }]">
              <a-select
                class="full-width"
                v-model:value="formData.contractScene"
                :options="contractSceneOptions"
                placeholder="请选择合同场景"
                :disabled="readonly"
              ></a-select>
            </a-form-item>
            <a-form-item
              label="合同录入日期"
              name="contractDate"
              :rules="[{ required: true, message: '请选择合同录入日期!' }]">
              <a-date-picker
                class="full-width"
                v-model:value="formData.contractDate"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择合同录入日期" 
                :disabled="readonly"/>
            </a-form-item>
            <a-form-item
              label="业主姓名"
              name="ownerName"
              :rules="[{ required: true, message: '请输入业主姓名!' }]">
              <a-input
                v-model:value="formData.ownerName"
                placeholder="请输入业主姓名"
                :disabled="readonly" />
            </a-form-item>
            <a-form-item
              label="跟单人"
              name="trackingPeopleName"
              :rules="[{ required: true, message: '请选择跟单人!' }]">
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
                @search="handleUserSearch"
                :disabled="readonly">
                 <template v-if="userFetching" #notFoundContent>
                  <a-spin size="small" />
                </template>
                 </a-select>
            </a-form-item>
            <a-form-item
              label="合同状态"
              name="contractStatus"
              :rules="[{ required: true, message: '请选择合同状态!' }]">
              <a-select
                class="full-width"
                v-model:value="formData.contractStatus"
                :options="contractStatusOptions"
                placeholder="请选择合同状态"
                :disabled="readonly"
              ></a-select>
            </a-form-item>
      </a-form>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import{ message, Form }from "ant-design-vue"
import { debounce } from "lodash-es"

interface Props {
  contractId: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

const contractSceneOptions = [
  {
    value: 1,
    label: '线上',
  },
  {
    value: 2,
    label: 'APP',
  },
  {
    value: 3,
    label: '电签',
  }
]

const contractStatusOptions = [
  {
    value: 1,
    label: '录入中',
  },
  {
    value: 2,
    label: '已录入',
  },
  {
    value: 3,
    label: '折扣已提交',
  },
  {
    value: 4,
    label: '合同已打印',
  },
  {
    value: 5,
    label: '草签作废',
  },
  {
    value: 6,
    label: '已签字',
  },
]


// 表单数据类型定义
interface FormData {
  contractScene: number | string
  contractStatus: number | string
  trackingPeopleName: string
  ownerName: string
  contractDate: string
}

// 表单数据
const formData = ref<FormData>({
  contractScene: '',
  contractStatus: '',
  trackingPeopleName: '',
  ownerName: '',
  contractDate: ''
})

/**
 * getContractDetail
 * 根据合同id获取合同详情
 */
const getContractDetail = () => {
    axios.get(`/api/contracts/${props.contractId}`).then(res => {
      formData.value = res.data
    }).catch(() => {
        message.error('请求失败')
    }) 
}

if(props.contractId) {
  getContractDetail()
}    


const users = ref([])
const userFetching = ref(false)

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


// 表单组件实例
const formRef = ref<typeof Form | null>(null)

/**
 * getFormData
 * @description 获取表单数据
 */
const getFormData = async () => {
  return await formRef.value?.validate()
}


defineExpose({
  getFormData
})

</script>
<style lang="less" scoped>
.full-width {
  width: 100% !important;
}
</style>

```

### 实现详情页

修改`src/pages/detail.vue`文件，引入`ContractInfo`组件：

```html
<template>
    <a-row
     justify="center">
        <h1 class="title">合同详情</h1>
    </a-row>
    <a-row
        justify="center">
        <div class="container">
            <contract-info
                readonly
                :contractId="contractId" />
        </div>
    </a-row>
    <a-row
        justify="center">
        <a-space align="center">
            <a-button @click="handleGoback">返回列表</a-button>
        </a-space>
    </a-row>
</template>
<script setup lang="ts">
    import ContractInfo from '../components/ContractInfo.vue'
    import { useRoute, useRouter } from 'vue-router'

    const route = useRoute()

    const contractId = route.params.id as string

    const router = useRouter()
    /**
     * handleGoback
     * @description 返回列表
     */
    const handleGoback = () => {
        router.push({
            path: '/list'
        })
    }
</script>
<style lang="less" scoped>  
    .title{
        font-size: 18px;
        line-height: 32px;
    }
    .container{
        width: 900px;
        padding: 0 0 20px;
    }
</style>

```

### 实现创建和编辑页

修改`src/pages/edit.vue`文件，引入`ContractInfo`组件：

```html
<template>
    <a-row
     justify="center">
        <h1 class="title">{{ title }}</h1>
    </a-row>
    <a-row
        justify="center">
        <div class="container">
            <contract-info
                ref="contractInfoRef"
                :contractId="contractId" />
        </div>
    </a-row>
    <a-row
        justify="center">
        <a-space align="center">
            <a-button
                type="primary"
                :loading="saveLoading"
                @click="handleSave">保存</a-button>
            <a-button @click="handleGoback">返回列表</a-button>
        </a-space>
    </a-row>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import ContractInfo from '../components/ContractInfo.vue'
    import { useRoute, useRouter } from 'vue-router'
    import axios from 'axios'
    import{ message }from "ant-design-vue"

    const route = useRoute()

    const contractId = route.params.id as string || ''
    const routName = route.name

    const isEdit = routName === 'Edit'

    const title = isEdit ? '编辑合同' : '新增合同'

    // 合同信息表单组件实例
    const contractInfoRef = ref<typeof ContractInfo | null>(null)

    const saveLoading = ref(false)

    /**
     * handleSave
     * @description 保存合同信息
     */
    const handleSave = async () => {
       const data = await contractInfoRef.value?.getFormData()
       saveLoading.value = true
       const savePath = isEdit ? '/api/contracts/update' : '/api/contracts'
       axios.post(savePath, { 
            ...data,
            id: contractId ?? null
         }).then(() => {
            saveLoading.value = false
            message.success('保存成功！')
        }).catch((error) => {
            saveLoading.value = false
            message.error(error.response.data?.message)
        })
    }

    const router = useRouter()

    /**
     * handleGoback
     * @description 返回列表
     */
    const handleGoback = () => {
        router.push({
            path: '/list'
        })
    }
</script>
<style lang="less" scoped>
    .title{
        font-size: 18px;
        line-height: 32px;
    }
    .container{
        width: 900px;
        padding: 0 0 20px;
    }
</style>
```

![结构示意](../../img/frontendGuide/actualCombat/project/x-0034.png)

## 结语

本节结束，恭喜已经完整从项目初始化一步一步实现了列表的增删改查页面和功能，其中我们了解了项目配置、路由配置、组件库使用、Vue页面编写、组件抽离和接口调用等方面，希望对你有所帮助。
