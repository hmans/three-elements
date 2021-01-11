import { Camera, Color, PerspectiveCamera, Raycaster, Scene } from "three"
import { EventProcessor } from "../EventProcessor"
import { ThreeElement } from "../ThreeElement"
import { normalizePointerPosition } from "../util/normalizePointerPosition"

export class ThreeScene extends ThreeElement.for(Scene) {
  static get observedAttributes() {
    return ["background-color", "camera"]
  }

  /** The current camera that is being used to render the scene. */
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
    this.eventProcessor.camera = camera
    this.handleWindowResize()
  }

  eventProcessor = new EventProcessor(this.game.renderer, this.object!, this.camera)

  constructor() {
    super()

    /* Set up camera */
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)

    /* Set up event processor */
  }

  readyCallback() {
    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.game.events.on("resize", this.handleWindowResize)

    /* Configure scene */
    const scene = this.object!

    /* Set up rendering */
    this.game.events.on("render", (dt) => {
      const { renderer } = this.game

      renderer.clearDepth()
      renderer.render(scene, this.camera)
    })

    /* Start processing events */
    this.eventProcessor.start()
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    this.game.events.off("resize", this.handleWindowResize)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "background-color":
        this.object!.background = new Color(newValue)
        break

      case "camera":
        setTimeout(() => {
          const el = document.querySelector(newValue) as ThreeElement<Camera>

          if (!el) {
            throw `A scene referenced a camera element with the selector "${newValue}", but it could not be found.`
          } else if (!(el.object instanceof Camera)) {
            throw `A scene referenced a camera element with the selector "${newValue}", but that element did not provide a camera object.`
          } else {
            this.camera = el.object!
            this.camera.lookAt(0, 0, 0)
          }
        })
        break
    }
  }

  handleWindowResize() {
    /* No matter what, we want to request a frame to be rendered. */
    this.game.requestFrame()

    /* Update camera */
    if (this._camera instanceof PerspectiveCamera) {
      this._camera.aspect = window.innerWidth / window.innerHeight
      this._camera.updateProjectionMatrix()
    }
  }
}

customElements.define("three-scene", ThreeScene)
