import { registeredThreeElements } from "three-elements"

export const makeProxy = (fun: (tagName: string) => Function) =>
  new Proxy(registeredThreeElements, {
    get: (target, prop: string) => fun(target[prop])
  })
