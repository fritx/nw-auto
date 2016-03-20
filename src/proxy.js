
import { isFunction } from 'util'


export default function proxy(source, target, keys) {
  keys.forEach((key) => {
    if (isFunction(target[key])) {
      source[key] = (...args) => target[key](...args)
    } else {
      Object.defineProperty(source, key, {
        get: () => target[key],
        set: (v) => { target[key] = v },
      })
    }
  })
}
