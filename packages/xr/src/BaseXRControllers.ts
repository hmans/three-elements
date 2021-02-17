import * as THREE from "three"
import { ThreeElement } from "three-elements"

/**
 * List of controller lifecycle and interaction events
 */
export const xrControllerEvents = [
  "connected",
  "select",
  "selectstart",
  "selectend",
  "squeeze",
  "squeezestart",
  "squeezeend",
  "disconnected"
]

/**
 * Base element for WebXR controllers and hands
 */
export class BaseXRControllers extends ThreeElement.for(THREE.Group) {
  /**
   * Fired when an XR controller is recognized and connected
   */
  connected?: string
  /**
   * Fired on a XR controller completes a primary action
   */
  select?: string
  /**
   * Fired when a XR controller begins a primary action
   */
  selectstart?: string
  /**
   * Fired when a XR controller ends a primary action
   */
  selectend?: string
  /**
   * Fired when a XR controller completes a primary squeeze action
   */
  squeeze?: string
  /**
   * Fired when a XR controller begins a primary squeeze action
   */
  squeezestart?: string
  /**
   * Fired when a XR controller ends its primary squeeze action
   */
  squeezeend?: string
  /**
   * Fired when a XR controller disconnects
   */
  disconnected?: string
  /**
   * An array of base XR controllers
   */
  controllers: THREE.Group[]

  mountedCallback() {
    super.mountedCallback()

    // Create controllers
    this.controllers = [
      (this.game.renderer as THREE.WebGLRenderer).xr.getController(0),
      (this.game.renderer as THREE.WebGLRenderer).xr.getController(1)
    ]

    // Setup controllers
    this.controllers.forEach((controller) => {
      // Create controller listeners
      xrControllerEvents.forEach((event) => {
        const listener = this[event]

        if (listener) {
          controller.addEventListener(event, listener)
        }
      })

      // Add controllers to object
      this.object.add(controller)
    })
  }

  attributeChangedCallback(key, oldValue, newValue) {
    // If not an observed event, early return to base element
    if (!xrControllerEvents.includes(key)) {
      return super.attributeChangedCallback(key, oldValue, newValue)
    }

    // Cleanup old listeners
    if (oldValue) {
      this.controllers.forEach((controller) => {
        const listener = this[key]

        controller.removeEventListener(key, listener)
      })
    }

    // Add new listeners
    if (newValue) {
      this[key] = new Function("event", newValue).bind(this)

      // If controllers are not online, skip update
      if (!this.controllers) return

      // Update controller listeners
      this.controllers.forEach((controller) => {
        const listener = this[key]

        controller.addEventListener(key, listener)
      })
    }
  }
}
