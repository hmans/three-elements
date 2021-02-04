import { registeredThreeElements } from "three-elements"

/**
 * Returns property keys of a type T that do not represent
 * functions.
 */
type NonFunctionProps<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

/**
 * Returns a partial type of T that only exposes properties
 * that we want to expose via our proxies.
 */
export type ProxyAttributes<T> = {
  [K in NonFunctionProps<T>]: T[K]
}

export const makeProxy = (fun: (tagName: string) => Function) =>
  new Proxy(registeredThreeElements, {
    get: (target, prop: string) => (target[prop] ? fun(target[prop]) : undefined)
  })
