import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import { ThreeElement } from "../ThreeElement"
import { registerThreeElement } from "../util/registerElement"

export class ThreeRectAreaLightHelper extends ThreeElement.for(RectAreaLightHelper) {}

registerThreeElement(
  "three-rect-area-light-helper",
  "RectAreaLightHelper",
  ThreeRectAreaLightHelper
)
