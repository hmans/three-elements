import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

export class ThreeOrbitControls extends ThreeElement<OrbitControls> {
  createControls() {
    const previousTarget = this.object?.target
    this.object?.dispose()

    /* Create new controls */
    this.object = new OrbitControls(this.scene.camera, this.game.renderer.domElement)
    if (previousTarget) this.object.target.copy(previousTarget)
    this.applyAllAttributes()

    this.object.addEventListener("change", () => {
      this.game.requestFrame()
    })
  }

  mountedCallback() {
    let { camera } = this.scene

    this.createControls()

    this.ontick = () => {
      /* Create a new controls instance if the camera changes */
      if (this.scene.camera !== camera) {
        this.createControls()
        camera = this.scene.camera
      }

      this.object!.update()
    }
  }

  removedCallback() {
    this.object?.dispose()
    super.removedCallback()
  }
}

registerElement("three-orbit-controls", ThreeOrbitControls)
