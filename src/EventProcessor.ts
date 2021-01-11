import { Camera, Intersection, Raycaster, Renderer, Scene, Vector2 } from "three"
import { ThreeElement } from "./ThreeElement"
import { intersectionInList } from "./util/intersectionInList"
import { normalizePointerPosition } from "./util/normalizePointerPosition"

export class EventProcessor {
  constructor(public renderer: Renderer, public scene: Scene, public camera: Camera) {}

  mouse = new Vector2()
  intersections = new Array<Intersection>()
  intersection?: Intersection

  private raycaster = new Raycaster()

  start() {
    const { renderer, scene, camera } = this
    let previousIntersections: Intersection[]

    /* Set up pointer event handling */
    renderer.domElement.addEventListener("pointermove", (e) => {
      this.mouse = normalizePointerPosition(renderer, e.x, e.y)

      /* Raycast against all objects in scene, and keep the intersections for later. */
      this.raycaster.layers.enableAll()
      this.raycaster.setFromCamera(this.mouse, camera)

      previousIntersections = this.intersections
      this.intersections = this.raycaster.intersectObjects(scene.children, true)
      this.intersection = this.intersections[0]

      /* Forward pointermove event */
      if (this.intersection) this.forwardEventToIntersection(e, this.intersection)

      /* Simulate pointerenter */
      for (const intersection of this.intersections) {
        if (!intersectionInList(intersection, previousIntersections)) {
          this.forwardEventToIntersection(new PointerEvent("pointerenter"), intersection)
        }
      }

      /* Simulate pointerleave */
      for (const intersection of previousIntersections) {
        if (!intersectionInList(intersection, this.intersections)) {
          this.forwardEventToIntersection(new PointerEvent("pointerleave"), intersection)
        }
      }

      /* TODO: pointerenter/pointerleave? */
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
