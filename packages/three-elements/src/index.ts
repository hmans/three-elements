import { ThreeElement } from "./ThreeElement"
import { defineThreeElements } from "./util/defineThreeElements"
import { registerElement } from "./util/registerElement"
export * from "./elements"
export { BaseElement } from "./BaseElement"
export { registerElement, ThreeElement }
export { makeProxy } from "./util/makeProxy"

/* Let's gooo! */
defineThreeElements()
