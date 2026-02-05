# promise-portal

像调用函数一样使用组件

## 安装

```bash
pnpm add promise-portal
```

## 在线示例

[https://codesandbox.io/p/github/tjyuanpeng/promise-portal](https://codesandbox.io/p/github/tjyuanpeng/promise-portal)

## 设计动机

类似 element-plus 的实现方式，模态框（Modal）本质是一个 Vue 组件。

在开发过程中，我们希望能像调用函数一样使用模态框：

无需通过 show 这类属性控制显隐状态

结果获取方式更直观

流程控制更简单，生命周期管理更便捷

因此，你可以使用 Promise-Portal 来提升开发效率。

### 改造前

作为组件使用，通过 ref 变量控制显隐状态和生命周期：

```vue
<script setup lang="ts">
import Comp from './components/name.vue'

const show = ref(false)
const onClick = () => {
  show.value = true
}
const onClosed = () => {
  show.value = false
}
</script>

<template>
  <el-button @click="onClick">
    click to open the Dialog
  </el-button>
  <Comp v-model="show" @closed="onClosed">
    a dialog content
  </Comp>
</template>
```

### 改造后

作为普通的 Promise 风格函数使用，开发体验更友好：

```vue
<script setup lang="ts">
import Comp from './components/name.vue'

const func = definePortal(Comp)
const onClick = async () => {
  const data = await func()
  console.log(data)
}
</script>

<template>
  <el-button @click="onClick">
    open the Dialog
  </el-button>
</template>
```

## 使用场景

### 在入口文件中创建 promise-portal 实例

```ts
// ./main.ts
import { createPromisePortal } from 'promise-portal'
import { createApp } from 'vue'

const app = createApp(App)
app.use(createPromisePortal())
```

### 使用 ContextProvider 设置全局上下文

```vue
<!-- ./App.vue -->
<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/zh_CN'
import { ContextProvider } from 'promise-portal'
</script>

<template>
  <a-config-provider :locale="locale">
    <ContextProvider>
      <router-view />
    </ContextProvider>
  </a-config-provider>
</template>
```

### 在组件中使用 usePortalContext 获取上下文

```vue
<!-- ./components/comp.vue -->
<script setup lang="ts">
import { usePortalContext } from 'promise-portal'

export interface Output {
  confirm: boolean
}
export interface Output {
  input: string
}
const props = defineProps<Input>()
const { resolve, show } = usePortalContext<Output>()
const onCancel = () => {
  resolve({ confirm: false })
}
</script>

<template>
  <a-modal v-model:open="show" @cancel="resolve">
    {{ props.input }}
  </a-modal>
</template>
```

### 在任意位置定义 portal，然后像 Promise 函数一样使用

```ts
// ./App.vue
import { definePortal } from 'promise-portal'
import Comp, { Input, Output } from './components/comp.vue'

const [func] = definePortal<Output, Input>(Comp)
const onClick = async () => {
  const result = await func({
    input: 'foo',
  })
  console.log(result)
}
```

## API 参考

### createPromisePortal

创建 promise-portal 实例，并挂载到 Vue 实例上

```ts
const instance = createPromisePortal()
app.use(instance)
```

### ContextProvider

用于全局设置上下文的组件

```vue
<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/zh_CN'
import { ContextProvider } from 'promise-portal'
</script>

<template>
  <a-config-provider :locale="locale">
    <ContextProvider>
      <router-view />
    </ContextProvider>
  </a-config-provider>
</template>
```

### usePortalContext

一个 Vue 组合式 API，用于在 portal 组件中获取上下文

```ts
const { resolve } = usePortalContext()

// 完整参数说明
const {
  resolve, // Promise 解析处理器
  reject, // Promise 拒绝处理器
  el, // 门户基础元素，会被注入到 'appendTo' 指定的元素中
  vnode, // 门户基础 Vue 虚拟节点
  unmountDelay, // 门户卸载延迟时间的响应式变量（毫秒）
  show, // 模态框显示状态的响应式变量（由门户控制）
} = usePortalContext({
  // 门户卸载延迟时间（毫秒），通常用于处理动画效果
  unmountDelay: 200,

  // show 响应式变量的初始值（默认值为 true）
  initialShowValue: true,
})
```

你可以通过 TypeScript 泛型指定 Promise 成功回调的返回结果类型：

```ts
export interface Output {
  confirm: boolean
}
const { resolve } = usePortalContext<Output>()
resolve({
  confirm: true,
})
```

你可以使用 show 变量控制模态框组件的显隐：

在执行卸载逻辑前，show.value 会被设置为 false；

可通过 initialShowValue 设置初始值，默认初始值为 true。

```vue
<script setup lang="ts">
const { resolve, show } = usePortalContext<Output>({ initialShowValue: true })
</script>

<template>
  <a-modal v-model:open="show" @cancel="resolve" />
</template>
```

### definePortal

定义一个 portal，返回一个 portal 函数

```ts
import Comp from './component.vue'

const portalFunc = definePortal(Comp)
portalFunc()
```

### 泛型参数

你可以通过泛型参数指定 portal 函数的输入参数类型和输出结果类型：

```ts
// component.vue
// App.vue
import Comp, { Input, Output } from './component.vue'

export interface Input {
  firstName: string
  lastName: string
}

export interface Output {
  fullName: string
  confirm: boolean
}

const props = defineProps<Input>()
const { resolve } = usePortalContext<Output>()
const portal = definePortal<Output, Input>(Comp)
const output = await portal({
  firstName: 'joe',
  lastName: 'watson',
})
```

### 定义无参数 portal

你可以定义一个无参数的 portal，只需要将泛型参数设置为 void：

```ts
// component.vue
// App.vue
import Comp, { Output } from './component.vue'

export interface Output {
  fullName: string
  confirm: boolean
}

const { resolve } = usePortalContext<Output>()
const portal = definePortal<Output, void>(Comp)
const output = await portal() // only allow empty parameter
```

### 定义 portal 选项

你可以通过第二个参数传递选项来定义 portal：

```ts
definePortal(Comp, {
  // 门户卸载延迟时间（毫秒），通常用于处理动画效果
  unmountDelay: 200,

  // show 响应式变量的初始值（默认值为 true）
  initialShowValue: true,

  // 可以是一个 DOM 元素、CSS 选择器、Ref 值或一个返回 DOM 元素的函数
  // 门户元素要追加到的 DOM 元素或 CSS 选择器（默认值为 document.body）
  appendTo: document.body,
})
```

### 检测未释放的 promise-portal 实例

检测是否有未正确释放的 promise-portal 实例

```ts
// main.ts
if (import.meta.env.DEV) {
  detectPromisePortalInstance()
}
```

检测未释放的 promise-portal 实例时，返回一个函数，用于停止检测

```ts
const stopHandler = detectPromisePortalInstance()
stopHandler() // 停止检测
```

你可以通过传递选项来自定义检测提示信息

```ts
detectPromisePortalInstance({
  text: 'Detected unreleased promise-portal instance',
  style: ' /styles you like/ ',
})
```

# 致谢

- [react portal](https://reactjs.org/docs/portals.html)
- [vue teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [@filez/portal](https://github.com/lenovo-filez/portal)
- [promise-modal](https://github.com/liruifengv/promise-modal)
