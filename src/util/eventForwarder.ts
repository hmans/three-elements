export const eventForwarder = (element: HTMLElement) => (originalEvent: Event) => {
  element.dispatchEvent(cloneEvent(originalEvent))
}

export const cloneEvent = (originalEvent: Event) => {
  const eventClass = originalEvent.constructor as typeof Event
  return new eventClass(originalEvent.type, originalEvent)
}
