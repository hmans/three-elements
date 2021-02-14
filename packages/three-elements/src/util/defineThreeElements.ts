import * as THREE from "three"
import { ThreeElement } from "../ThreeElement"
import { IConstructor } from "../types"
import { dasherize } from "./dasherize"
import { registerThreeElement } from "./registerElement"

export const defineThreeElements = () => {
  /*
  For everything else inside THREE.* that can be constructed, automatically
  generate a custom element.
  */
  for (const threeProp of Object.getOwnPropertyNames(THREE)) {
    const threeClass = THREE[threeProp as keyof typeof THREE]
    const tagName = `three-${dasherize(threeProp)}`

    if (typeof threeClass === "function" && "prototype" in threeClass) {
      registerThreeElement(tagName, threeProp, ThreeElement.for(threeClass as IConstructor))
    }
  }
}
