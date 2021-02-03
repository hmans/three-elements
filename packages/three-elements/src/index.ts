import * as THREE from "three"
import { ThreeElement } from "./ThreeElement"
import { IConstructable } from "./types"
import { dasherize } from "./util/dasherize"
import { registerElement } from "./util/registerElement"
export * from "./elements"
export { BaseElement } from "./BaseElement"
export { registerElement, ThreeElement }

const defineThreeElements = () => {
  /* Custom elements we want to set up manually in order to get the naming right */
  registerElement("three-object3d", ThreeElement.for(THREE.Object3D))

  /*
  For everything else inside THREE.* that can be constructed, automatically
  generate a custom element.
  */
  for (const thing of Object.getOwnPropertyNames(THREE)) {
    const klass = THREE[thing as keyof typeof THREE]
    const name = `three-${dasherize(thing)}`

    if (typeof klass === "function" && "prototype" in klass) {
      registerElement(name, ThreeElement.for(klass as IConstructable))
    }
  }
}

/* Let's gooo! */
defineThreeElements()
