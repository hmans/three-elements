import { Camera, Intersection, Raycaster, Renderer, Scene, Vector2 } from "three"
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
        /* Pass the event on to that element */
      }
    })
  }
}
