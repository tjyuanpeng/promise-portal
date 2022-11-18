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

## Use

### install in the entry file

```ts
// ./main.ts
import { createPromisePortal } from 'promise-portal'

const app = createApp(App)
app.use(createVuePortal())
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

## Reference

[@filez/portal](https://github.com/lenovo-filez/portal)

[promise-modal](https://github.com/liruifengv/promise-modal)
