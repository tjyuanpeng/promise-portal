export interface DetectorOptions {
  style?: string
  text?: string
}

function detect(options: DetectorOptions) {
  const {
    style = 'position:fixed;top:0;right:0;text-align:right;line-height:1.3;color:red;z-index:9999;',
    text = `Detected that the promise-portal instance has not been properly destroyed<br>Please make sure to call resolve/reject to release the instance correctly.`,
  } = options
  const containers = document.querySelectorAll('[data-promise-portal-container]')
  const detector = document.querySelector('[data-promise-portal-detector]')
  if (containers.length === 0) {
    detector?.remove()
    return
  }
  if (!detector) {
    const el = document.createElement('div')
    el.setAttribute('data-promise-portal-detector', '')
    el.setAttribute('style', style)
    el.innerHTML = text
    document.body.appendChild(el)
  }
}

export const detectPromisePortalInstance = (options: DetectorOptions = {}) => {
  const timer = setInterval(() => detect(options), 200)
  return () => clearInterval(timer)
}
