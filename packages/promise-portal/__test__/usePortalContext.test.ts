import type { Input as BasicInput, Output as BasicOutput } from './fixtures/basic.vue'
import { definePortal } from '../src'
import Basic from './fixtures/basic.vue'

describe('usePortalContext', () => {
  it('throw error when app context is not found', async () => {
    const [basic] = definePortal<BasicOutput, BasicInput>(Basic)
    expect(() => basic({ input: 'basic usage input value' })).toThrow('[promise-portal]')
  })
})
