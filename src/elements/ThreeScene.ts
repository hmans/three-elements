import { Color, PerspectiveCamera, Scene } from "three"
import { ThreeElement } from "../ThreeElement"

export class ThreeScene extends ThreeElement.for(Scene) {
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  readyCallback() {
    const scene = this.object!

    /* Set up camera */
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)

    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener("resize", this.handleWindowResize, false)

    scene.background = new Color("#c93")
    this.onupdate = (dt) => {
      this.game?.renderer.render(scene, this.camera)
    }
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    window.removeEventListener("resize", this.handleWindowResize, false)
  }

  handleWindowResize() {
    /* Update camera */
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }
}

customElements.define("three-scene", ThreeScene)
