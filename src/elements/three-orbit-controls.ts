import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

export class ThreeOrbitControls extends ThreeElement<OrbitControls> {
  controls?: OrbitControls

  readyCallback() {
    const { renderer } = this.game
    let { camera } = this.scene
    this.controls = new OrbitControls(camera, renderer.domElement)

    this.onupdate = () => {
      if (!this.controls) return

      /*
      Check if the scene's camera has changed.
      TODO: in the future, the scene may event a "camerachanged" event that we could hook into.
      */
      if (this.scene.camera !== camera) {
        this.controls.dispose
        camera = this.scene.camera
        this.controls = new OrbitControls(camera, renderer.domElement)
      }

      this.controls.update()
    }

    this.controls.addEventListener("change", () => {
      this.game.requestFrame()
    })
  }

  disconnectedCallback() {
    this.controls?.dispose()
    super.disconnectedCallback()
  }
}

registerElement("three-orbit-controls", ThreeOrbitControls)
