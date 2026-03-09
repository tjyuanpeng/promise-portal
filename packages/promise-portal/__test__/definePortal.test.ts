import type { App } from 'vue'
import type { Input as BasicInput, Output as BasicOutput } from './fixtures/basic.vue'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { createApp } from 'vue'
import { createPromisePortal, definePortal } from '../src'
import Basic from './fixtures/basic.vue'

describe('definePortal', () => {
  let app: App
  beforeEach(() => {
    app = createApp({ render: () => null })
    app.use(createPromisePortal())
    app.mount(document.body)
  })
  afterEach(() => {
    app.unmount()
  })

  it('opens portal dialog → user clicks Confirm → promise resolves with confirm true', async () => {
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic)
    const promise = basic({ input: 'basic usage input value' })
    await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /confirm/i })
    await user.click(button)
    const output = await promise
    expect(output).toEqual({ confirm: true })
  })

  it('opens portal dialog → user clicks Cancel → promise resolves with confirm false', async () => {
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic)
    const promise = basic({ input: 'basic usage input value' })
    await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /cancel/i })
    await user.click(button)
    const output = await promise
    expect(output).toEqual({ confirm: false })
  })

  it('append to body', async () => {
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic, { appendTo: 'body' })
    basic({ input: 'basic usage input value' })
    await waitFor(() => expect(document.querySelector('div[data-promise-portal-container]')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /cancel/i })
    await user.click(button)
  })
  it('append-to use fucntion', async () => {
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic, { appendTo: () => document.body })
    basic({ input: 'basic usage input value' })
    await waitFor(() => expect(document.querySelector('div[data-promise-portal-container]')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /cancel/i })
    await user.click(button)
  })
  it('append-to use Ref value', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const r = ref(el)
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic, { appendTo: r })
    basic({ input: 'basic usage input value' })
    await waitFor(() => expect(el.querySelector('div[data-promise-portal-container]')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /cancel/i })
    await user.click(button)
    el.remove()
  })
  it('append-to use wrong value', async () => {
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic, { appendTo: '#wrong-value' })
    expect(() => basic({ input: 'basic usage input value' })).toThrow('[promise-portal]')
  })
})

describe('definePortal without installing', () => {
  it('set app context', async () => {
    const app = createApp({ render: () => null })
    app.mount(document.body)
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic, { appContext: app._context })
    basic({ input: 'basic usage input value' })
    await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /confirm/i })
    await user.click(button)
    app.unmount()
  })

  it('get app context from current instance', async () => {
    let promise
    const MyComponent = defineComponent(() => () => {
      const [basic] = definePortal<BasicOutput, BasicInput>(Basic)
      promise = basic({ input: 'basic usage input value' })
    })
    render(MyComponent)
    await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /cancel/i })
    await user.click(button)
    const output = await promise
    expect(output).toEqual({ confirm: false })
  })
  it('get app context from context holder', async () => {
    let promise
    const MyComponent = defineComponent(() => {
      const [basic, ch] = definePortal<BasicOutput, BasicInput>(Basic)
      promise = basic({ input: 'basic usage input value' })
      return () => h(ch)
    })
    render(MyComponent)
    await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument(), { timeout: 1000 })
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /cancel/i })
    await user.click(button)
    const output = await promise
    expect(output).toEqual({ confirm: false })
  })
})
