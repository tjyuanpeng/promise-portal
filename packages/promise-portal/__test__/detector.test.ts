import { waitFor } from '@testing-library/vue'
import { detectPromisePortalInstance } from '../src'

describe('detector', () => {
  it('detects promise portal instance right', async () => {
    const stop = detectPromisePortalInstance()
    const el = document.createElement('div')
    el.setAttribute('data-promise-portal-container', '')
    document.body.appendChild(el)
    await waitFor(() => expect(document.querySelector('[data-promise-portal-detector]')).toBeInTheDocument(), { timeout: 1000 })
    el.remove()
    await waitFor(() => expect(document.querySelector('[data-promise-portal-detector]')).not.toBeInTheDocument(), { timeout: 1000 })
    stop()
  })
  it('should be stoppable', async () => {
    const stop = detectPromisePortalInstance()
    const el = document.createElement('div')
    el.setAttribute('data-promise-portal-container', '')
    document.body.appendChild(el)
    await waitFor(() => expect(document.querySelector('[data-promise-portal-detector]')).toBeInTheDocument(), { timeout: 1000 })
    stop()
    await waitFor(() => expect(document.querySelector('[data-promise-portal-detector]')).not.toBeInTheDocument(), { timeout: 1000 })
    el.remove()
  })
})
