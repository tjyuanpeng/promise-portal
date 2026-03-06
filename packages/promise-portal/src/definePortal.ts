import type { AppContext, Component, Ref } from 'vue'
import { createVNode, defineComponent, getCurrentInstance, isRef, ref, render, unref } from 'vue'
import { getProvidesFromContextProvider } from './ContextProvider'
import { getActiveApp } from './instance'
import { setScope } from './scope'

export interface DefinePortalOptions {
  unmountDelay?: number
  initialShowValue?: boolean
  appendTo?: string | HTMLElement | Ref<HTMLElement> | (() => HTMLElement)
  appContext?: AppContext
  provides?: AppContext['provides']
}

export type DefinePortalResult<Output, Input> = [
  (props?: Input, children?: unknown) => Promise<Output>,
  Component,
]

const resolveTarget = (to: DefinePortalOptions['appendTo']) => {
  if (typeof to === 'string') {
    return document.querySelector<HTMLElement>(to)
  } else if (isRef(to)) {
    return unref(to)
  } else if (typeof to === 'function') {
    return to()
  }
  return to
}

export const definePortal = <Output = any, Input = any>(component: Component, options: DefinePortalOptions = {}): DefinePortalResult<Output, Input> => {
  // get appContext from current instance
  let ciAP: { appContext?: AppContext, provides?: AppContext['provides'] } = {}
  const ci = getCurrentInstance()
  if (ci) {
    ciAP = {
      appContext: ci.appContext,
      provides: (ci as any).provides,
    }
  }

  // create ContextHolder
  let chAP: { appContext?: AppContext, provides?: AppContext['provides'] } = {}
  const ContextHolder = defineComponent(() => () => {
    const ci = getCurrentInstance()
    if (ci) {
      chAP = {
        appContext: ci.appContext,
        provides: (ci as any).provides,
      }
    }
  })

  // define portal function
  const portal = (props?: Input, children?: unknown): Promise<Output> => {
    const appContext = options.appContext ?? chAP?.appContext ?? ciAP?.appContext ?? getActiveApp()?._context
    if (!appContext) {
      throw new Error('[promise-portal]: no appContext found. Install promise-portal or use ContextHolder to get that')
    }
    const provides = options.provides ?? chAP?.provides ?? getProvidesFromContextProvider(appContext.app) ?? ciAP?.provides ?? appContext.provides

    // create vnode
    const vnode = createVNode(component, props as any, children)
    vnode.appContext = Object.create(appContext, { provides: { value: provides } })

    // create element to render
    const el = document.createElement('div')
    el.setAttribute('data-promise-portal-container', '')

    // get target to append element
    const target = resolveTarget(options.appendTo ?? document.body)
    if (!target) {
      throw new Error('[promise-portal]: invalid appendTo target - no element found or provided.')
    }
    target.appendChild(el)

    const unmountDelay = ref(options.unmountDelay ?? 0)
    const show = ref(options.initialShowValue ?? true)

    // create promise
    return new Promise<Output>((resolve, reject) => {
      setScope(vnode, {
        resolve,
        reject,
        target,
        el,
        vnode,
        unmountDelay,
        show,
      })
      render(vnode, el)
    }).finally(() => {
      show.value = false
      setTimeout(() => {
        if (el) {
          render(null, el)
          el.remove()
        }
      }, unmountDelay.value)
    })
  }
  return [portal, ContextHolder]
}
