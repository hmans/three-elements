import { Camera, Intersection, Raycaster, Renderer, Scene, Vector2 } from "three"
import { ThreeElement } from "./ThreeElement"
import { normalizePointerPosition } from "./util/normalizePointerPosition"

export class EventProcessor {
  constructor(public renderer: Renderer, public scene: Scene, public camera: Camera) {}

  mouse = new Vector2()
  intersections = new Array<Intersection>()
  intersection?: Intersection

  private raycaster = new Raycaster()

  start() {
    const { renderer, scene, camera } = this
    /* Set up pointer event handling */
    renderer.domElement.addEventListener("pointermove", (e) => {
      this.mouse = normalizePointerPosition(renderer, e.x, e.y)

      /* Raycast against all objects in scene, and keep the intersections for later. */
      this.raycaster.layers.enableAll()
      this.raycaster.setFromCamera(this.mouse, camera)

      this.intersections = this.raycaster.intersectObjects(scene.children, true)
      this.intersection = this.intersections[0]

      /* If we have an intersection, find the element representing the object */
      if (this.intersection) {
        const element = this.intersection.object.userData.threeElement as ThreeElement<any>

        /* Pass the event on to that element */
        const event = new PointerEvent("pointermove", {
          view: window,
          bubbles: true,
          cancelable: true
        })
        element.dispatchEvent(event)
      }
    })
  }
}
