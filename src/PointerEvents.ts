import { Camera, Intersection, Raycaster, Renderer, Scene, Vector2 } from "three"
import { ThreeElement } from "./ThreeElement"
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
    const { renderer, scene, camera } = this
    let previousIntersections: Intersection[]
    let previousIntersection: Intersection | undefined

    /* Set up pointer event handling */
    renderer.domElement.addEventListener("pointermove", (e) => {
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
        this.forwardEventToIntersection(e, this.intersection)
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
        if (this.intersection) this.forwardEventToIntersection(e, this.intersection)
      })
    }
  }

  private forwardEventToIntersection(originalEvent: Event, intersection: Intersection) {
    /* Clone the original event... */
    const eventClass = originalEvent.constructor as typeof Event
    const event = new eventClass(originalEvent.type, originalEvent)

    /* ...and dispatch it! */
    this.dispatchEventToIntersection(event, intersection)
  }

  private dispatchEventToIntersection(event: Event, intersection: Intersection) {
    /* Find the element representing the hovered scene object */
    /*
    FIXME: it's possible that the intersected event is not represented by an element.
    In this case, we will need to walk up the scene graph to find the first element that is.
    */
    const element = intersection.object.userData.threeElement as ThreeElement<any>

    /* ...and dispatch it! */
    element.dispatchEvent(event)
  }
}
