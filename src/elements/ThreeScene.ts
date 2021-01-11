import { Camera, Color, PerspectiveCamera, Scene } from "three"
import { ThreeElement } from "../ThreeElement"

export class ThreeScene extends ThreeElement.for(Scene) {
  static get observedAttributes() {
    return ["camera"]
  }

  private _camera: Camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  get camera() {
    return this._camera
  }

  set camera(camera) {
    this._camera = camera
    this.handleWindowResize()
  }

  constructor() {
    super()

    /* Set up camera */
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)
  }

  readyCallback() {
    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.game.events.on("resize", this.handleWindowResize)

    /* Configure scene */
    const scene = this.object!
    scene.background = new Color("#c93")

    this.game.events.on("update", (dt) => {
      this.game?.renderer.render(scene, this.camera)
    })
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    this.game.events.off("resize", this.handleWindowResize)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "camera":
        setTimeout(() => {
          const el = document.getElementById(newValue) as ThreeElement<Camera>

          if (!el) {
            throw `A scene referenced a camera element with the ID "${newValue}", but no element with that ID could be found.`
          } else if (!(el.object instanceof Camera)) {
            throw `A scene referenced a camera element with the ID "${newValue}", but that element did not provide a camera object.`
          } else {
            this.camera = el.object!
          }
        })
    }
  }

  handleWindowResize() {
    /* Update camera */
    if (this._camera instanceof PerspectiveCamera) {
      this._camera.aspect = window.innerWidth / window.innerHeight
      this._camera.updateProjectionMatrix()
    }
  }
}

customElements.define("three-scene", ThreeScene)
