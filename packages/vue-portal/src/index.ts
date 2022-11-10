import { App, Component, VNode, createVNode, render, inject, getCurrentInstance } from 'vue'

export interface ProvideData<R> {
  resolve: (value: R | PromiseLike<R>) => void
  reject: (reason?: any) => void
  el: HTMLDivElement
  vNode: VNode
}

export interface Portal<R = any> {
  app: App
  map: WeakMap<VNode, ProvideData<R>>
  install: (app: App) => void
}

export interface PortalOptions<R> {
  portal?: Portal<R>
  unmountDelay?: number
}

const portalSymbol = process.env.NODE_ENV !== 'production' ? Symbol('vue-portal') : Symbol()

let activePortal: Portal

export const getActivePortal = () => activePortal

export const setActivePortal = (portal: Portal) => (activePortal = portal)

export const createPortal = () => {
  const portal: Portal = {
    app: undefined as unknown as App,
    map: new WeakMap(),
    install(app: App) {
      portal.app = app
      setActivePortal(portal)
      app.provide(portalSymbol, portal)
    },
  }
  return portal
}

export const usePortalComponent = <TOutput = any>() => {
  const portal = inject<Portal<TOutput>>(portalSymbol)
  if (!portal) {
    throw new Error('[vue-portal]: no portal found.')
  }

  const ins = getCurrentInstance()
  if (!ins?.vnode) {
    throw new Error('[vue-portal]: no vnode found.')
  }

  const data = portal.map.get(ins.vnode)
  if (!data) {
    throw new Error('[vue-portal]: no inject data found.')
  }

  return data
}

export const definePortal = <TOutput = any, TProps = any>(
  component: Component,
  { portal, unmountDelay = 0 }: PortalOptions<TOutput> = {}
) => {
  const _portal = portal || (getCurrentInstance() && inject<Portal<TOutput>>(portalSymbol)) || activePortal
  if (!_portal) {
    throw new Error('[vue-portal]: no portal found.')
  }

  return (props?: TProps, children?: unknown) => {
    let el = document.createElement('div')
    document.body.appendChild(el)

    let vNode: VNode
    const p = new Promise<TOutput>((resolve, reject) => {
      vNode = createVNode(component, props as any, children)
      _portal.map.set(vNode, { resolve, reject, el, vNode })
      vNode.appContext = _portal.app._context
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
