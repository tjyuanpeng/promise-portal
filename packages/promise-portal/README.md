# promise-portal

let you use react portal in vue, and with promise

## Install

```bash
// pnpm
pnpm add promise-portal -D

// npm
npm install promise-portal -D

// yarn
yarn add promise-portal --D
```

## Online Demo

[Demo on codesandbox](https://codesandbox.io/p/github/tjyuanpeng/promise-portal)

[Demo on StackBlitz](https://stackblitz.com/github/tjyuanpeng/promise-portal-demo)

## Relative Resourece

- [react protal](https://reactjs.org/docs/portals.html)
- [vue teleport](https://vuejs.org/guide/built-ins/teleport.html)

## Why

like element-plus, the modal is a vue component

in development, we want use modal like a function

no `show` property to control show/hide, gettting result is more explicit

easier to control workflow, and easier to handle life-cycles

### Before

use as acomponent, with ref value to control visibility and life-cycles

```ts
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
  <el-button @click="onClick"> click to open the Dialog </el-button>
  <Comp v-model="show" @closed="onClosed"> a dialog content </Comp>
</template>
```

### After

use as a normal promise-style function, so happy to develop

```ts
<script setup lang="ts">
import Comp, { Input, Output } from './components/name.vue'
const func = definePortal<Output, Input>(Comp)
const onClick = async () => {
  const data = await func()
  console.log(data)
}
</script>
<template>
  <el-button @click="onClick"> click to open the Dialog </el-button>
</template>
```

## Use

### install in the entry file

```ts
// ./main.ts
import { createPromisePortal } from 'promise-portal'

const app = createApp(App)
app.use(createPromisePortal())
```

### in component, use `usePortalContext` to get portal context

```ts
// ./components/name.vue
import { usePortalContext } from 'promise-portal'

const { resolve } = usePortalContext<Output>()
const onClose = () => {
  resolve({ confirm: false, fullName: '' })
}
```

### define portal, use it like a promise-style function

```ts
// ./App.vue
import { definePortal } from 'promise-portal'
import Comp, { Input, Output } from './components/name.vue'

const func = definePortal<Output, Input>(Comp)
const onClick = async () => {
  const data = await func({ firstName: 'joe', lastName: 'watson' })
  if (!data.confirm) {
    return
  }
  console.log(data)
}
```

## API Reference

- createPromisePortal

  create promise-portal instance

  ```ts
  const instance = createPromisePortal()
  app.use(instance) // vue instance
  ```

- getActiveInstance

  get active promise-portal instance

  ```ts
  const instance = getActiveInstance()
  ```

- setActiveInstance

  set promise-portal instance to be active

  ```ts
  setActiveInstance(instance)
  ```

- usePortalContext

  a vue composition api, use in portal component to get context of portal

  ```ts
  const { resolve, reject, el, vNode } = usePortalContext()
  // resolve: promise resolve handler
  // reject: promise reject handler
  // el: portal base element, injecting to body element
  // vNode: portal base vue vnode
  ```

  you can use typescript generic types

  ```ts
  const { resolve } = usePortalContext<Output>()
  resolve({ ... })    // an object of type Output
  ```

- definePortal

  define a portal, return a portal function

  ```ts
  import Comp from './component.vue'
  const portal = definePortal(Comp)
  portal() // return a promise
  ```

  you can define generic types to check input object and output object

  ```ts
  // component.vue
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

  // App.vue
  import Comp, { Input, Output } from './component.vue'
  const portal = definePortal<Output, Input>(Comp)
  const output = await portal({
    firstName: 'joe',
    lastName: 'watson',
  })
  ```

  how to define a portal with empty parameter

  ```ts
  // component.vue
  export interface Output {
    fullName: string
    confirm: boolean
  }

  const { resolve } = usePortalContext<Output>()

  // App.vue
  import Comp, { Output } from './component.vue'
  const portal = definePortal<Output, void>(Comp)
  const output = await portal() // only allow empty parameter
  ```

  you can set a config to definePortal

  ```ts
  definePortal(Comp, {
    // set a time gap before portal unmount,
    // in general, it to wait for animation effect
    unmountDelay: 1000,
    // set promise-portal instance explicitly to render this portal
    // not use the active instance internally
    // of course, you can use `setActiveInstance` to set active instance
    instance: promisePortalInstance,
  })
  ```

## Link

- [@filez/portal](https://github.com/lenovo-filez/portal)
- [promise-modal](https://github.com/liruifengv/promise-modal)
