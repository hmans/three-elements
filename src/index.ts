export * from "./elements"
import { dasherize, underscore } from "inflected"
import * as THREE from "three"
import { ThreeElement } from "./ThreeElement"
import { IConstructable } from "./types"

const defineThreeElements = () => {
  /* Convenience function to create a custom element based on a generated class. */
  const makeClass = <T>(klass: IConstructable<T>) => {
    return class extends ThreeElement<T> {
      constructor() {
        super()
        this.klass = klass
      }
    }
  }

  /* Custom elements we want to set up manually in order to get the naming right */
  customElements.define("three-object3d", makeClass(THREE.Object3D))

  /*
  For everything else inside THREE.* that can be constructed, automatically
  generate a custom element.
  */
  for (const thing of Object.getOwnPropertyNames(THREE)) {
    const klass = THREE[thing as keyof typeof THREE]
    const name = `three-${dasherize(underscore(thing))}`

    if (klass instanceof Function && !customElements.get(name)) {
      customElements.define(name, makeClass(klass as IConstructable))
    }
  }
}

/* Let's gooo! */
defineThreeElements()
