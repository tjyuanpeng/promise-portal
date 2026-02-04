import type { App, AppContext, Component, Ref, RendererElement, VNode } from 'vue'
import { createVNode, defineComponent, getCurrentInstance, inject, ref, render } from 'vue'

const promisePortalSymbol = Symbol('promise-portal')

export const version = `2.0.0`

export interface UsePortalContextOptions {
  unmountDelay?: number
  initialShowValue?: boolean
}

export interface DefinePortalOptions extends UsePortalContextOptions {
  appendTo?: string | RendererElement | null | undefined
}

export type DefinePortalResult<Output, Input> = [
  (props?: Input, children?: unknown) => Promise<Output>,
  Component,
]

export interface Scope<R> {
  resolve: (value: R | PromiseLike<R>) => void
  reject: (reason?: any) => void
  el: HTMLDivElement
  vnode: VNode
  unmountDelay: Ref<number>
  show: Ref<boolean>
}

export interface Instance<R = any> {
  app: App
  map: WeakMap<VNode, Scope<R>>
  provides: any
  install: (app: App) => void
}

let activeInstance: Instance

export const createPromisePortal = () => {
  const instance: Instance = {
    app: undefined as unknown as App,
    map: new WeakMap(),
    provides: undefined,
    install(app: App) {
      instance.app = app
      activeInstance = instance
      app.provide(promisePortalSymbol, instance)
    },
  }
  return instance
}

export const usePortalContext = <Output = any>(options: UsePortalContextOptions = {}) => {
  const instance = inject<Instance<Output>>(promisePortalSymbol)
  if (!instance) {
    throw new Error('[promise-portal]: no instance found. Did you forget to install promise-portal?')
  }
  const vnode = getCurrentInstance()?.vnode
  if (!vnode) {
    throw new Error('[promise-portal]: no vnode found in current component instance.')
  }
  // get scope from instance map
  const scope = instance.map.get(vnode)
  if (!scope) {
    throw new Error('[promise-portal]: no inject scope found.')
  }
  if (options.unmountDelay !== undefined) {
    scope.unmountDelay.value = options.unmountDelay
  }
  if (options.initialShowValue !== undefined) {
    scope.show.value = options.initialShowValue
  }
  return scope
}

const resolveTarget = (to: DefinePortalOptions['appendTo']) => typeof to === 'string' ? document.querySelector(to) : to

export const definePortal = <Output = any, Input = any>(component: Component, options: DefinePortalOptions = {}): DefinePortalResult<Output, Input> => {
  // get intance from inject through current component instance or from active instance
  const instance = (getCurrentInstance() && inject<Instance<Output>>(promisePortalSymbol)) ?? activeInstance
  if (!instance) {
    throw new Error('[promise-portal]: no instance found. Did you forget to install promise-portal?')
  }

  let appContext: AppContext = getCurrentInstance()?.appContext ?? instance.app._context
  let provides: AppContext['provides'] = instance.provides ?? appContext.provides

  // define ContextHolder component
  const ContextHolder = defineComponent(() => () => {
    const ci = getCurrentInstance()
    if (ci) {
      appContext = ci.appContext
      provides = (ci as any).provides
    }
  })

  // define portal function
  const portal = (props?: Input, children?: unknown): Promise<Output> => {
    // create portal container
    const el = document.createElement('div')
    el.setAttribute('data-promise-portal-container', '')

    // append portal container to target
    const target = resolveTarget(options.appendTo ?? document.body)
    if (!target) {
      throw new Error('[promise-portal]: invalid appendTo target - no element found or provided.')
    }
    target.appendChild(el)

    const unmountDelay = ref(options.unmountDelay ?? 0)
    const show = ref(options.initialShowValue ?? true)

    // create promise
    const promise = new Promise<Output>((resolve, reject) => {
      // create vnode
      const vnode = createVNode(component, props as any, children)

      // resolve app context
      vnode.appContext = Object.create(appContext, { provides: { value: provides } })

      // create scope & set to map
      instance.map.set(vnode, {
        resolve,
        reject,
        el,
        vnode,
        unmountDelay,
        show,
      })

      // render vnode
      render(vnode, el)
    })
    promise.finally(() => {
      show.value = false

      setTimeout(() => {
        render(null, el)
        el?.remove()
      }, unmountDelay.value)
    })
    return promise
  }
  return [portal, ContextHolder]
}

export const ContextProvider = defineComponent({
  name: 'PromisePortalContextProvider',
  setup(_props, { slots }) {
    const provides = (getCurrentInstance() as any)?.provides
    if (provides && activeInstance) {
      activeInstance.provides = provides
    }
    return () => slots.default?.()
  },
})
