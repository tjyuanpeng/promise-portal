import { App, Component, VNode, createVNode, render, inject, getCurrentInstance } from 'vue'

export interface PortalContext<R> {
  resolve: (value: R | PromiseLike<R>) => void
  reject: (reason?: any) => void
  el: HTMLDivElement
  vNode: VNode
}

export interface PromisePortal<R = any> {
  app: App
  map: WeakMap<VNode, PortalContext<R>>
  install: (app: App) => void
}

export interface PortalOptions<R> {
  instance?: PromisePortal<R>
  unmountDelay?: number
}

const promisePortalSymbol = process.env.NODE_ENV !== 'production' ? Symbol('promise-portal') : Symbol()

let activeInstance: PromisePortal

export const getActiveInstance = () => activeInstance

export const setActiveInstance = (instance: PromisePortal) => (activeInstance = instance)

export const createPromisePortal = () => {
  const instance: PromisePortal = {
    app: undefined as unknown as App,
    map: new WeakMap(),
    install(app: App) {
      instance.app = app
      setActiveInstance(instance)
      app.provide(promisePortalSymbol, instance)
    },
  }
  return instance
}

export const usePortalContext = <TOutput = any>() => {
  const instance = inject<PromisePortal<TOutput>>(promisePortalSymbol)
  if (!instance) {
    throw new Error('[promise-portal]: no instance found.')
  }

  const ins = getCurrentInstance()
  if (!ins?.vnode) {
    throw new Error('[promise-portal]: no vnode found.')
  }

  const data = instance.map.get(ins.vnode)
  if (!data) {
    throw new Error('[promise-portal]: no inject data found.')
  }

  return data
}

export const definePortal = <TOutput = any, TProps = any>(
  component: Component,
  { instance, unmountDelay = 0 }: PortalOptions<TOutput> = {}
) => {
  const _instance =
    instance || (getCurrentInstance() && inject<PromisePortal<TOutput>>(promisePortalSymbol)) || activeInstance
  if (!_instance) {
    throw new Error('[promise-portal]: no instance found. Do you forget install promise-portal?')
  }

  return (props?: TProps, children?: unknown) => {
    let el = document.createElement('div')
    document.body.appendChild(el)

    let vNode: VNode
    const p = new Promise<TOutput>((resolve, reject) => {
      vNode = createVNode(component, props as any, children)
      _instance.map.set(vNode, { resolve, reject, el, vNode })
      vNode.appContext = _instance.app._context
      render(vNode, el)
    })

    p.finally(() => {
      setTimeout(() => {
        if (el) {
          render(null, el)
          document.body.removeChild(el)
        }
        el = null as any
        vNode = null as any
      }, unmountDelay)
    })

    return p
  }
}
