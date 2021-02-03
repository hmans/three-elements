import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import { ThreeElement } from "../ThreeElement"
import { getThreeObjectBySelector } from "../util/getThreeObjectBySelector"
import { registerElement } from "../util/registerElement"

export class ThreeRectAreaLightHelper extends ThreeElement.for(RectAreaLightHelper) {
  attributeChangedCallback(
    name: string,
    oldValue: string | undefined,
    newValue: string | undefined
  ) {
    switch (name) {
      case "light":
        if (newValue) this.object!.light = getThreeObjectBySelector(newValue)
        return true

      default:
        return super.attributeChangedCallback(name, oldValue, newValue)
    }
  }
}

registerElement("three-rect-area-light-helper", ThreeRectAreaLightHelper)
