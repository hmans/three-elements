import { Camera, Intersection, Object3D, Raycaster, Renderer, Scene, Vector2 } from "three"
import { ThreeScene } from "./elements/three-scene"
import { ThreeElement } from "./ThreeElement"
import { cloneEvent, eventForwarder } from "./util/eventForwarder"
import { normalizePointerPosition } from "./util/normalizePointerPosition"

export class PointerEvents {
  /** Stores the current (normalized) mouse position. */
  position = new Vector2()

  /** Last pointermove event */
  protected __pointerMoveEvent?: Event

  /** A list of intersections for the last pointer event that performed a raycast. */
  intersections = new Array<Intersection>()

  /** The top-most of our current intersections. */
  intersection?: Intersection

  private raycaster = new Raycaster()

  constructor(public sceneElement: ThreeScene) {}

  start() {
    const scene = this.sceneElement.object!
    const { renderer } = this.sceneElement.game
    let previousIntersections: Intersection[]
    let previousIntersection: Intersection | undefined

    /* When the pointer moves, update its position */
    renderer.domElement.addEventListener("pointermove", (e) => {
      this.__pointerMoveEvent = e
      normalizePointerPosition(renderer, e.x, e.y, this.position)
    })

    /* On every tick, raycast the current pointer position against the scene */
    this.sceneElement.game.emitter.on("tick", () => {
      /* If we haven't previously received a pointermove event, bail now. */
      if (!this.__pointerMoveEvent) return

      const { camera } = this.sceneElement

      /* Raycast against all objects in scene, and keep the intersections for later. */
      this.raycaster.layers.enableAll()
      this.raycaster.setFromCamera(this.position, camera)

      previousIntersections = this.intersections
      previousIntersection = this.intersection
      this.intersections = this.raycaster.intersectObjects(scene.children, true)
      this.intersection = this.intersections[0]

      /* pointermove and pointerover */
      if (this.intersection) {
        this.dispatchEventToIntersection(cloneEvent(this.__pointerMoveEvent), this.intersection)
        this.dispatchEventToIntersection(
          new PointerEvent("pointerover", this.__pointerMoveEvent),
          this.intersection
        )
      }

      /* Simulate pointerenter and friends */
      if (this.intersection?.object !== previousIntersection?.object) {
        if (previousIntersection) {
          this.dispatchEventToIntersection(
            new PointerEvent("pointerleave", this.__pointerMoveEvent),
            previousIntersection
          )
          this.dispatchEventToIntersection(
            new PointerEvent("pointerout", this.__pointerMoveEvent),
            previousIntersection
          )
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
