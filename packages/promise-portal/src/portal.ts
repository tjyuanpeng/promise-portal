import type { App, Component, Ref, VNode } from 'vue'
import { createVNode, defineComponent, getCurrentInstance, inject, ref, render } from 'vue'

const promisePortalSymbol = Symbol('promise-portal')

export const version = `2.0.0`

export interface Options {
  unmountDelay?: number
  initialShowValue?: boolean
}

export interface Context<R> {
  resolve: (value: R | PromiseLike<R>) => void
  reject: (reason?: any) => void
  el: HTMLDivElement
  vnode: VNode
  setUnmountDelay: (unmountDelay: number) => void
  show: Ref<boolean>
}

export interface Instance<R = any> {
  defaultOptions: Options
  app: App
  map: WeakMap<VNode, Context<R>>
  provides: any
  install: (app: App) => void
}

let activeInstance: Instance

export const getActiveInstance = () => activeInstance

export const setActiveInstance = (instance: Instance) => (activeInstance = instance)

export const createPromisePortal = (defaultOptions: Options = {}) => {
  const instance: Instance = {
    defaultOptions,
    app: undefined as unknown as App,
    map: new WeakMap(),
    provides: undefined,
    install(app: App) {
      instance.app = app
      setActiveInstance(instance)
      app.provide(promisePortalSymbol, instance)
    },
  }
  return instance
}

export const usePortalContext = <TOutput = any>(options: Options = {}) => {
  const instance = inject<Instance<TOutput>>(promisePortalSymbol)
  if (!instance) {
    throw new Error('[promise-portal]: no instance found.')
  }
  const vnode = getCurrentInstance()?.vnode
  if (!vnode) {
    throw new Error('[promise-portal]: no vnode found.')
  }
  const data = instance.map.get(vnode)
  if (!data) {
    throw new Error('[promise-portal]: no inject data found.')
  }
  if (options.unmountDelay !== undefined) {
    data.setUnmountDelay(options.unmountDelay)
  }
  if (options.initialShowValue !== undefined) {
    data.show.value = options.initialShowValue
  }
  return data
}

export const definePortal = <TOutput = any, TProps = any>(
  component: Component,
  options: Options & { instance?: Instance<TOutput> } = {},
): [(props?: TProps, children?: unknown) => Promise<TOutput>, Component] => {
  const instance
    = options.instance ?? (getCurrentInstance() && inject<Instance<TOutput>>(promisePortalSymbol)) ?? getActiveInstance()
  if (!instance) {
    throw new Error('[promise-portal]: no instance found. Do you forget install promise-portal?')
  }

  let appContext = getCurrentInstance()?.appContext
  let contextHolderProvides: any = null
  const ContextHolder = defineComponent(() => () => {
    appContext = getCurrentInstance()?.appContext
    contextHolderProvides = (getCurrentInstance() as any)?.provides
  })

  const portal = (props?: TProps, children?: unknown) => {
    const el = document.createElement('div')
    el.setAttribute('data-promise-portal-container', '')
    document.body.appendChild(el)

    let unmountDelay = options.unmountDelay ?? instance.defaultOptions.unmountDelay
    const setUnmountDelay = (delay: number) => {
      unmountDelay = delay
    }
    const show = ref(options.initialShowValue ?? instance.defaultOptions.initialShowValue ?? true)

    let vnode: VNode
    const p = new Promise<TOutput>((resolve, reject) => {
      vnode = createVNode(component, props as any, children)
      instance.map.set(vnode, { resolve, reject, el, vnode, setUnmountDelay, show })
      const ac = appContext ?? instance.app._context
      vnode.appContext = Object.create(ac, {
        provides: {
          value: contextHolderProvides ?? instance.provides ?? ac.provides,
        },
      })
      render(vnode, el)
    })
    p.finally(() => {
      show.value = false
      setTimeout(() => {
        render(null, el)
        document.body.removeChild(el)
      }, unmountDelay)
    })
    return p
  }
  return [portal, ContextHolder]
}

export const ContextProvider = defineComponent({
  name: 'PromisePortalContextProvider',
  setup(_props, { slots }) {
    const p = (getCurrentInstance() as any)?.provides
    const instance = getActiveInstance()
    if (p && instance) {
      instance.provides = p
    }
    return () => slots.default?.()
  },
})
