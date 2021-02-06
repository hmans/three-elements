import { Camera, Intersection, Object3D, Raycaster, Renderer, Scene, Vector2 } from "three"
import { ThreeElement } from "./ThreeElement"
import { cloneEvent, eventForwarder } from "./util/eventForwarder"
import { normalizePointerPosition } from "./util/normalizePointerPosition"

export class PointerEvents {
  /** Stores the current (normalized) mouse position. */
  position = new Vector2()

  /** A list of intersections for the last pointer event that performed a raycast. */
  intersections = new Array<Intersection>()

  /** The top-most of our current intersections. */
  intersection?: Intersection

  private raycaster = new Raycaster()

  constructor(public renderer: Renderer, public scene: Scene, public camera: Camera) {}

  start() {
    const { renderer, scene } = this
    let previousIntersections: Intersection[]
    let previousIntersection: Intersection | undefined

    /* Set up pointer event handling */
    renderer.domElement.addEventListener("pointermove", (e) => {
      const { camera } = this

      normalizePointerPosition(renderer, e.x, e.y, this.position)

      /* Raycast against all objects in scene, and keep the intersections for later. */
      this.raycaster.layers.enableAll()
      this.raycaster.setFromCamera(this.position, camera)

      previousIntersections = this.intersections
      previousIntersection = this.intersection
      this.intersections = this.raycaster.intersectObjects(scene.children, true)
      this.intersection = this.intersections[0]

      /* pointermove and pointerover */
      if (this.intersection) {
        this.dispatchEventToIntersection(cloneEvent(e), this.intersection)
        this.dispatchEventToIntersection(new PointerEvent("pointerover", e), this.intersection)
      }

      /* Simulate pointerenter and friends */
      if (this.intersection?.object !== previousIntersection?.object) {
        if (previousIntersection) {
          this.dispatchEventToIntersection(
            new PointerEvent("pointerleave", e),
            previousIntersection
          )
          this.dispatchEventToIntersection(new PointerEvent("pointerout", e), previousIntersection)
        }

        if (this.intersection) {
          this.dispatchEventToIntersection(new PointerEvent("pointerenter"), this.intersection)
        }
      }
    })

    /* Now just forward a bunch of DOM events to the current intersect. */
    for (const type of ["pointerdown", "pointerup", "click", "dblclick"]) {
      renderer.domElement.addEventListener(type, (e) => {
        if (this.intersection) this.dispatchEventToIntersection(cloneEvent(e), this.intersection)
      })
    }
  }

  private dispatchEventToIntersection(event: Event, intersection: Intersection) {
    /* Find the first object that actually has a reference to an element */
    let object: Object3D | null

    for (object = intersection.object; object; object = object.parent) {
      if (object.userData.threeElement) {
        /* Find the element representing the hovered scene object */
        const element = object.userData.threeElement as ThreeElement<any>

        /* ...and dispatch it! */
        eventForwarder(element)(event)

        return
      }
    }
  }
}
