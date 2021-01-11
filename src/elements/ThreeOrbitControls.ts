import { ThreeElement } from "../ThreeElement"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Scene } from "three"
import { ThreeScene } from "./ThreeScene"

export class ThreeOrbitControls extends ThreeElement<OrbitControls> {
  controls?: OrbitControls

  readyCallback() {
    const { renderer } = this.game!
    const { camera } = this.scene!
    this.controls = new OrbitControls(camera, renderer.domElement)
  }

  disconnectedCallback() {
    this.controls?.dispose()
  }
}

customElements.define("three-orbit-controls", ThreeOrbitControls)
