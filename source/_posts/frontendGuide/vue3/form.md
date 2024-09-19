---
title: 表单处理
date: 2024-06-06 13:00:00
post: comments
enable: true
categories:
  - [前端开发手册, Vue3 奇妙之旅：轻松掌握新语法]
tags:
  - vue
  - vue3
---

# 表单处理

表单处理是 Web 开发中的一项重要任务，Vue 3 提供了强大的工具来简化表单的绑定与验证。本文将介绍表单绑定与验证、表单验证和自定义表单组件的相关内容，并使用 Ant Design Vue 作为第三方库示例。

## 表单绑定与验证

在 Vue 3 中，表单绑定通过 `v-model` 指令实现，允许我们轻松地在表单控件和组件数据之间创建双向绑定。

### 基本用法

以下是一个简单的表单绑定示例：

```html
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <label for="name">Name:</label>
      <input id="name" v-model="formData.name" type="text" />

      <label for="email">Email:</label>
      <input id="email" v-model="formData.email" type="email" />

      <button type="submit">Submit</button>
    </form>

    <p>Name: {{ formData.name }}</p>
    <p>Email: {{ formData.email }}</p>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    setup() {
      const formData = ref({
        name: '',
        email: '',
      });

      const handleSubmit = () => {
        console.log('Form submitted:', formData.value);
      };

      return {
        formData,
        handleSubmit,
      };
    },
  };
</script>
```

## 表单验证

表单验证可以通过手动编写验证逻辑或使用第三方库来实现。以下示例展示了如何使用 Ant Design Vue 进行表单验证。

### 使用 Ant Design Vue 示例

安装 Ant Design Vue：

```bash
npm install ant-design-vue
```

在项目中引入 Ant Design Vue：

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
app.use(Antd);
app.mount('#app');
```

### 创建表单验证示例

```html
<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item ref="name" label="Activity name" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item label="Activity zone" name="region">
      <a-select
        v-model:value="formState.region"
        placeholder="please select your zone"
      >
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Activity time" required name="date1">
      <a-date-picker
        v-model:value="formState.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="Instant delivery" name="delivery">
      <a-switch v-model:checked="formState.delivery" />
    </a-form-item>
    <a-form-item label="Activity type" name="type">
      <a-checkbox-group v-model:value="formState.type">
        <a-checkbox value="1" name="type">Online</a-checkbox>
        <a-checkbox value="2" name="type">Promotion</a-checkbox>
        <a-checkbox value="3" name="type">Offline</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="Resources" name="resource">
      <a-radio-group v-model:value="formState.resource">
        <a-radio value="1">Sponsor</a-radio>
        <a-radio value="2">Venue</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Activity form" name="desc">
      <a-textarea v-model:value="formState.desc" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
</template>
<script setup>
  import { reactive, ref, toRaw } from 'vue';
  const formRef = ref();
  const labelCol = {
    span: 5,
  };
  const wrapperCol = {
    span: 13,
  };
  const formState = reactive({
    name: '',
    region: undefined,
    date1: undefined,
    delivery: false,
    type: [],
    resource: '',
    desc: '',
  });
  const rules = {
    name: [
      {
        required: true,
        message: 'Please input Activity name',
        trigger: 'change',
      },
      {
        min: 3,
        max: 5,
        message: 'Length should be 3 to 5',
        trigger: 'blur',
      },
    ],
    region: [
      {
        required: true,
        message: 'Please select Activity zone',
        trigger: 'change',
      },
    ],
    date1: [
      {
        required: true,
        message: 'Please pick a date',
        trigger: 'change',
        type: 'object',
      },
    ],
    type: [
      {
        type: 'array',
        required: true,
        message: 'Please select at least one activity type',
        trigger: 'change',
      },
    ],
    resource: [
      {
        required: true,
        message: 'Please select activity resource',
        trigger: 'change',
      },
    ],
    desc: [
      {
        required: true,
        message: 'Please input activity form',
        trigger: 'blur',
      },
    ],
  };
  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const resetForm = () => {
    formRef.value.resetFields();
  };
</script>
```

## 自定义表单组件

自定义表单组件可以提高代码的可重用性和可维护性。以下示例展示了如何创建和使用自定义表单组件。

### 创建自定义表单组件

```html
<!-- PriceUnit.vue -->
<template>
  <span>
    <a-input
      type="text"
      :value="value.number"
      style="width: 100px"
      @change="onNumberChange"
    />
    <a-select
      :value="value.currency"
      style="width: 80px; margin: 0 8px"
      :options="[
        { value: 'rmb', label: 'RMB' },
        { value: 'dollar', label: 'Dollar' },
      ]"
      @change="onCurrencyChange"
    ></a-select>
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import { Form } from 'ant-design-vue';

  export type Currency = 'rmb' | 'dollar';

  interface PriceValue {
    number: number;
    currency: Currency;
  }
  export default defineComponent({
    props: {
      value: {
        type: Object as PropType<PriceValue>,
        isRequired: true,
        default: {
          number: 0,
          currency: 'rmb',
        },
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      const formItemContext = Form.useInjectFormItemContext();
      const triggerChange = (changedValue: {
        number?: number;
        currency?: Currency;
      }) => {
        emit('update:value', { ...props.value, ...changedValue });
        formItemContext.onFieldChange();
      };
      const onNumberChange = (e: InputEvent) => {
        const newNumber = parseInt((e.target as any).value || '0', 10);
        triggerChange({ number: newNumber });
      };
      const onCurrencyChange = (newCurrency: Currency) => {
        triggerChange({ currency: newCurrency });
      };

      return {
        onNumberChange,
        onCurrencyChange,
      };
    },
  });
</script>
```

### 使用自定义表单组件

```html
<template>
  <a-form :model="formData" :rules="rules" ref="formRef">
    <a-form-item
      name="price"
      label="Price"
      :rules="[{ validator: checkPrice }]"
    >
      <PriceUnit v-model:value="formState.price" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSubmit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import PriceUnit from './PriceUnit.vue';

  export default {
    components: {
      PriceUnit,
    },
    setup() {
      const formData = ref({
        price: {
          currency: 'rmb',
          number: 0,
        },
      });

      const errors = ref({});

      const rules = {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          {
            type: 'email',
            message: 'Email is invalid',
            trigger: ['blur', 'change'],
          },
        ],
      };

      const formRef = ref(null);

      const validate = () => {
        return formRef.value
          .validate()
          .then(() => true)
          .catch((err) => {
            errors.value = err.errorFields.reduce((acc, field) => {
              acc[field.name[0]] = field.errors[0];
              return acc;
            }, {});
            return false;
          });
      };

      const handleSubmit = async () => {
        const isValid = await validate();
        if (isValid) {
          message.success('Form submitted successfully!');
          console.log('Form submitted:', formData.value);
        } else {
          message.error('Form validation failed.');
        }
      };

      const checkPrice = (_, value) => {
        if (value.number > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
      };

      return {
        formData,
        errors,
        rules,
        formRef,
        handleSubmit,
        checkPrice,
      };
    },
  };
</script>
```

通过以上内容，您可以在 Vue 3 中实现表单的绑定与验证，使用 [Ant Design Vue](https://next.antdv.com/components/form-cn) 进行表单验证，以及创建和使用自定义表单组件来提高代码的可复用性和可维护性。
