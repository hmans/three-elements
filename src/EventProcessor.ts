import { Camera, Raycaster, Renderer, Scene } from "three"
import { normalizePointerPosition } from "./util/normalizePointerPosition"

export class EventProcessor {
  constructor(public renderer: Renderer, public scene: Scene, public camera: Camera) {}

  start() {
    const { renderer, scene, camera } = this
    /* Set up pointer event handling */
    renderer.domElement.addEventListener("pointermove", (e) => {
      const mouse = normalizePointerPosition(renderer, e.x, e.y)

      /* Raycast against all objects in scene */
      const raycaster = new Raycaster()
      raycaster.layers.enableAll()
      raycaster.setFromCamera(mouse, camera)
      const intersections = raycaster.intersectObjects(scene.children, true)

      /* Identify which element is representing the found object */

      /* Pass the event on to that element */
    })
  }
}
