import { ContextProvider, getProvidesFromContextProvider } from '../src'

describe('contextProvider', () => {
  it('get provides from context provider', async () => {
    const app = createApp({
      render: () => h(ContextProvider),
    })
    const el = document.createElement('div')
    app.mount(el)
    expect(getProvidesFromContextProvider(app)).toEqual({})
    app.unmount()
    el.remove()
  })
})
