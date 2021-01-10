import { ThreeElement } from "../ThreeElement"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export class ThreeOrbitControls extends ThreeElement<OrbitControls> {
  controls?: OrbitControls

  mount() {
    const { camera, renderer } = this.game!
    this.controls = new OrbitControls(camera, renderer.domElement)
  }

  unmount() {
    this.controls?.dispose()
  }
}

customElements.define("three-orbit-controls", ThreeOrbitControls)
