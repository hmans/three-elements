import * as THREE from "three"
import { ThreeElement } from "./ThreeElement"
import { IConstructable } from "./types"
import { dasherize } from "./util/dasherize"
import { registerComponent } from "./util/registerComponent"

const defineThreeElements = () => {
  /* Convenience function to create a custom element based on a generated class. */
  const makeClass = <T>(constructor: IConstructable<T>) => {
    /*
    Create an anonymous class that inherits from our cool base class, but sets
    its own Three.js constructor property.
    */
    return class extends ThreeElement<T> {
      protected static threeConstructor = constructor
    }
  }

  /* Custom elements we want to set up manually in order to get naming and order right */
  registerComponent("three-object3d", makeClass(THREE.Object3D))
  registerComponent("three-mesh", makeClass(THREE.Mesh))

  /*
  For everything else inside THREE.* that can be constructed, automatically
  generate a custom element.
  */
  for (const thing of Object.getOwnPropertyNames(THREE)) {
    const klass = THREE[thing as keyof typeof THREE]
    const name = `three-${dasherize(thing)}`

    if (typeof klass === "function" && "prototype" in klass) {
      registerComponent(name, makeClass(klass as IConstructable))
    }
  }
}

/* Let's gooo! */
defineThreeElements()

export * from "./elements"
export { registerComponent }
