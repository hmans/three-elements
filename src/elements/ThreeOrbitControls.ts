import { ThreeElement } from "../ThreeElement"
import { registerComponent } from "../util/registerComponent"

import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls"

export class ThreeOrbitControls extends ThreeElement<OrbitControlsImpl> {
  static threeConstructor = OrbitControlsImpl

  constructor() {
    super()
    console.log(this.object)
  }
}

registerComponent("three-orbit-controls", ThreeOrbitControls)
