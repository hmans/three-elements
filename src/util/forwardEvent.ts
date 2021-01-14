export const forwardEvent = (element: HTMLElement, event: Event) =>
  element.dispatchEvent(new CustomEvent(event.type, event))
