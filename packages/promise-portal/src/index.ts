import { App, Component, VNode, createVNode, render, inject, getCurrentInstance } from 'vue'

export interface PortalContext<R> {
  resolve: (value: R | PromiseLike<R>) => void
  reject: (reason?: any) => void
  el: HTMLDivElement
  vNode: VNode
  setUnmountDelay: (unmountDelay: number) => void
}

export interface PromisePortal<R = any> {
  defaultOptions: {
    unmountDelay?: number
  }
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

export const createPromisePortal = (defaultOptions = {}) => {
  const instance: PromisePortal = {
    defaultOptions,
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
  { instance, unmountDelay }: PortalOptions<TOutput> = {}
) => {
  const _instance =
    instance || (getCurrentInstance() && inject<PromisePortal<TOutput>>(promisePortalSymbol)) || activeInstance
  if (!_instance) {
    throw new Error('[promise-portal]: no instance found. Do you forget install promise-portal?')
  }

  return (props?: TProps, children?: unknown) => {
    let el = document.createElement('div')
    el.setAttribute('data-promise-portal-container', '')
    document.body.appendChild(el)
    let _delay = unmountDelay || _instance.defaultOptions?.unmountDelay
    const setUnmountDelay = (delay: number) => {
      _delay = delay
    }

    let vNode: VNode
    const p = new Promise<TOutput>((resolve, reject) => {
      vNode = createVNode(component, props as any, children)
      _instance.map.set(vNode, { resolve, reject, el, vNode, setUnmountDelay })
      vNode.appContext = _instance.app._context
      render(vNode, el)
    })

    p.finally(() => {
      console.log('delay', _delay)
      setTimeout(() => {
        if (el) {
          render(null, el)
          document.body.removeChild(el)
        }
        el = null as any
        vNode = null as any
      }, _delay)
    })

    return p
  }
}

export const detectPromisePortalInstance = ({
  selector = '[data-promise-portal-container]',
  style = 'position:fixed;top:0;right:0;text-align:right;line-height:1.3;color:red;z-index:9999;',
  text = `检测到promise-portal实例未被正确销毁<br>请正确调用resolve/reject释放实例`,
} = {}) => {
  const nodes = document.querySelectorAll(selector)
  if (nodes.length > 0) {
    let el = document.querySelector('[data-promise-portal-detector]')
    if (!el) {
      el = document.createElement('div')
      el.setAttribute('data-promise-portal-detector', '')
      el.setAttribute('style', style)
      el.innerHTML = text
      document.body.appendChild(el)
    }
  } else {
    document.querySelector('[data-promise-portal-detector]')?.remove()
  }
  setTimeout(detectPromisePortalInstance, 200)
}
