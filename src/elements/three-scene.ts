import { Camera, Color, PerspectiveCamera, Scene } from "three"
import { PointerEvents } from "../PointerEvents"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

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
      this.handleWindowResize()

    if (this.pointer) {
      this.pointer.camera = camera
    }
  }

  /** The pointer events system. */
  pointer?: PointerEvents

  constructor() {
    super()

    /* Set up camera */
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)
  }

  readyCallback() {
    /* Set up event processor */
    this.pointer = new PointerEvents(this.game.renderer, this.object!, this.camera)

    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener("resize", this.handleWindowResize)
    this.handleWindowResize()

    /* Set up rendering */
    this.render = this.render.bind(this)
    this.game.addEventListener("rendertick", this.render)

    /* Start processing events */
    this.pointer!.start()
  }

  render() {
    const { renderer } = this.game

    renderer.clearDepth()
    renderer.render(this.object!, this.camera)
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    this.game.removeEventListener("rendertick", this.render)
    window.removeEventListener("resize", this.handleWindowResize)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "background-color":
        this.object!.background = new Color(newValue)
        return

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
        return
    }

    super.attributeChangedCallback(name, oldValue, newValue)
  }

  handleWindowResize() {
    /* Get width and height from our parent element */
    const el = this.game
    const width = el.clientWidth
    const height = el.clientHeight

    /* Update camera */
    if (this._camera instanceof PerspectiveCamera) {
      this._camera.aspect = width / height
      this._camera.updateProjectionMatrix()
    }

    /* No matter what, we want to request a frame to be rendered. */
    this.game.requestFrame()
  }
}

registerElement("three-scene", ThreeScene)
