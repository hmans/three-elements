import * as THREE from "three"
import { registerElement, ThreeElement } from ".."
import { IConstructable } from "../types"
import { dasherize } from "./dasherize"

export const defineThreeElements = () => {
  /*
  For everything else inside THREE.* that can be constructed, automatically
  generate a custom element.
  */
  for (const threeProp of Object.getOwnPropertyNames(THREE)) {
    const threeClass = THREE[threeProp as keyof typeof THREE]
    const tagName = `three-${dasherize(threeProp)}`

    if (typeof threeClass === "function" && "prototype" in threeClass) {
      registerElement(tagName, ThreeElement.for(threeClass as IConstructable))
    }
  }
}
