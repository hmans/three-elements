import { Camera, Color, OrthographicCamera, PerspectiveCamera, Scene } from "three"
import { PointerEvents } from "../PointerEvents"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

export class ThreeScene extends ThreeElement.for(Scene) {
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

  mountedCallback() {
    /* Set up event processor */
    this.pointer = new PointerEvents(this.game.renderer, this.object!, this.camera)

    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener("resize", this.handleWindowResize)
    this.handleWindowResize()

    /* Set up rendering */
    this.render = this.render.bind(this)
    this.game.emitter.on("rendertick", this.render)

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
    this.game.emitter.off("rendertick", this.render)
    window.removeEventListener("resize", this.handleWindowResize)

    super.disconnectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "background-color":
        this.object!.background = new Color(newValue)
        return true
    }

    return super.attributeChangedCallback(name, oldValue, newValue)
  }

  handleWindowResize() {
    /* Get width and height from our parent element */
    const el = this.game
    const width = el.clientWidth
    const height = el.clientHeight
    const aspect = width / height

    /* Update camera */
    if (this._camera instanceof PerspectiveCamera) {
      this._camera.aspect = aspect
      this._camera.updateProjectionMatrix()
    } else if (this._camera instanceof OrthographicCamera) {
      /* We're going to assume that the vertical frustum represents our frustum size. */
      const frustumSize = this._camera.top - this._camera.bottom

      /* Adjust horizontal frustum */
      this._camera.left = (frustumSize * aspect) / -2
      this._camera.right = (frustumSize * aspect) / 2

      this._camera.updateProjectionMatrix()
    }

    /* No matter what, we want to request a frame to be rendered. */
    this.game.requestFrame()
  }
}

registerElement("three-scene", ThreeScene)
