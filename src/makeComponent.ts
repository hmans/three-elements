import { registerElement } from "./util/registerElement"

type ComponentConfiguration = {
  setup: Function
  teardown: Function
}

export class ThreeElementsComponent extends HTMLElement {
  setup?: Function
  teardown?: Function

  connectedCallback() {
    this.setup?.()
  }

  disconnectedCallback() {
    this.teardown?.()
  }
}

export const makeComponent = (name: string, configuration: ComponentConfiguration) => {
  const klass = class extends ThreeElementsComponent {}
  Object.assign(klass.prototype, configuration)
  registerElement(name, klass)
}
