import { IConstructor } from "../types"

export const eventForwarder = (element: HTMLElement) => <T extends Event>(originalEvent: T) => {
  element.dispatchEvent(cloneEvent(originalEvent))
}

export const cloneEvent = <T extends Event>(originalEvent: T) => {
  const eventClass = originalEvent.constructor as IConstructor<T>
  return new eventClass(originalEvent.type, originalEvent)
}
