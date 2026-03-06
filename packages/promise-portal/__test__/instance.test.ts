import { createPromisePortal, getActiveApp } from '../src'

describe('instance', () => {
  it('set active app when install promise portal', async () => {
    const app = createApp({})
    app.use(createPromisePortal())
    expect(getActiveApp()).toBe(app)
  })
  it('clear active app after unmount', async () => {
    const app = createApp({ render: () => null })
    app.use(createPromisePortal())
    const el = document.createElement('div')
    app.mount(el)
    app.unmount()
    expect(getActiveApp()).toBe(undefined)
    el.remove()
  })
  it('set different app to active', async () => {
    const app1 = createApp({ render: () => null })
    app1.use(createPromisePortal())
    const el = document.createElement('div')
    app1.mount(el)

    const app2 = createApp({ render: () => null })
    app2.use(createPromisePortal())
    app2.use(createPromisePortal())

    app1.unmount()
    expect(getActiveApp()).toBe(app2)
    el.remove()
  })
})
