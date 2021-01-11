import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { ThreeElement } from "../ThreeElement"

export class ThreeOrbitControls extends ThreeElement<OrbitControls> {
  controls?: OrbitControls

  readyCallback() {
    const { renderer } = this.game
    const { camera } = this.scene
    this.controls = new OrbitControls(camera, renderer.domElement)
  }

  disconnectedCallback() {
    this.controls?.dispose()
  }
}

customElements.define("three-orbit-controls", ThreeOrbitControls)
