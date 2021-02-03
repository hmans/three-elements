import { registeredThreeElements } from "./registerElement"

export const makeProxy = (fun: (tagName: string) => Function) =>
  new Proxy(registeredThreeElements, {
    get: (target, prop: string) => fun(target[prop])
  })
