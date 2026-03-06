import type { Scope } from './scope'
import { getCurrentInstance } from 'vue'
import { getScope } from './scope'

export interface UsePortalContextOptions {
  unmountDelay?: number
  initialShowValue?: boolean
}

export const usePortalContext = <Output = any>(options: UsePortalContextOptions = {}): Scope<Output> => {
  const vnode = getCurrentInstance()?.vnode
  const scope = getScope<Output>(vnode)
  if (!scope) {
    throw new Error('[promise-portal]: no scope found in current component instance.')
  }
  if (options.unmountDelay !== undefined) {
    scope.unmountDelay.value = options.unmountDelay
  }
  if (options.initialShowValue !== undefined) {
    scope.show.value = options.initialShowValue
  }
  return scope
}
