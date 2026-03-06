import type { Ref, VNode } from 'vue'

export interface Scope<R> {
  resolve: (value: R | PromiseLike<R>) => void
  reject: (reason?: any) => void
  target: HTMLElement
  el: HTMLDivElement
  vnode: VNode
  unmountDelay: Ref<number>
  show: Ref<boolean>
}

export const vnodeMap = new WeakMap<VNode, Scope<any>>()

export const getScope = <T>(vnode?: VNode): Scope<T> | undefined => {
  return vnode ? vnodeMap.get(vnode) as Scope<T> : undefined
}

export const setScope = <T>(vnode: VNode, scope: Scope<T>) => {
  vnodeMap.set(vnode, scope)
}
