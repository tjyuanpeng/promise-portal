# promise-portal

use component as a promisd-like function

## Installation

```bash
pnpm add promise-portal
```

## Online Demo

[https://codesandbox.io/p/github/tjyuanpeng/promise-portal](https://codesandbox.io/p/github/tjyuanpeng/promise-portal)

## Motivation

like element-plus, the modal is a vue component

in development, we want use modal like a function

no `show` property to control show/hide, gettting result is more explicit

easier to control workflow, and easier to handle life-cycles

so you can use Promise-Portal to save your life-time

### before

use as a component, with ref value to control visibility and life-cycles

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

### after

use as a normal promise-style function, so happy to develop

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

## Use Case

### create promise-portal instance in the entry file

```ts
// ./main.ts
import { createPromisePortal } from 'promise-portal'
import { createApp } from 'vue'

const app = createApp(App)
app.use(createPromisePortal())
```

### use `ContextProvider` to set context globally

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

### in component, use `usePortalContext` to use portal context

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

### define portal in anywhere, then use it like a promise-style function

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

## API Reference

### createPromisePortal

create promise-portal instance, set to vue instance

```ts
const instance = createPromisePortal()
app.use(instance)
```

### ContextProvider

a component to set context globally

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

a vue composition api, use in portal component to get context of portal

```ts
const { resolve } = usePortalContext()

// detail
const {
  resolve, // promise resolve handler
  reject, // promise reject handler
  el, // portal base element, injected into 'appendTo' element
  vnode, // portal base vue vnode
  unmountDelay, // Ref for portal unmount delay (ms)
  show, // Ref for modal display state (controlled by portal)
} = usePortalContext({
  // Unmount delay (ms) for portal, usually for animation effects
  unmountDelay: 200,

  // Initial value for the show ref (defaults to true)
  initialShowValue: true,
})
```

you can use typescript generic types to promise fulfilled result

```ts
export interface Output {
  confirm: boolean
}
const { resolve } = usePortalContext<Output>()
resolve({
  confirm: true,
})
```

you can use `show` to control modal component

before `unmount`, `show.value = false` will be setted

use `initialShowValue` to set inital value, default inital value is `true`

```vue
<script setup lang="ts">
const { resolve, show } = usePortalContext<Output>({ initialShowValue: true })
</script>

<template>
  <a-modal v-model:open="show" @cancel="resolve" />
</template>
```

### definePortal

define a portal, return a portal function

```ts
import Comp from './component.vue'

const portalFunc = definePortal(Comp)
portalFunc()
```

you can define generic types to check input object and output object

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

define a portal with empty parameter

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

you can set a options to definePortal

```ts
definePortal(Comp, {
  // Unmount delay (ms) for portal, usually for animation effects
  unmountDelay: 200,

  // Initial value for the show ref (defaults to true)
  initialShowValue: true,

  // a dom element or CSS selector or Ref value or a function returing a dom element,
  // append the portal element to (defaults to document.body)
  appendTo: document.body,
})
```

### detectPromisePortalInstance

detect whether the instance has been properly destroyed

```ts
// main.ts
if (import.meta.env.DEV) {
  detectPromisePortalInstance()
}
```

the return value is a function to stop detecting

```ts
const stopHandler = detectPromisePortalInstance()
stopHandler() // stop detecting
```

You can pass in other values to customize it.

```ts
detectPromisePortalInstance({
  text: 'Detected unreleased promise-portal instance',
  style: ' /styles you like/ ',
})
```

# Acknowledgements

- [react portal](https://reactjs.org/docs/portals.html)
- [vue teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [@filez/portal](https://github.com/lenovo-filez/portal)
- [promise-modal](https://github.com/liruifengv/promise-modal)
