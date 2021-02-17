import * as THREE from "three"
import { ThreeGame, registerThreeElement } from "three-elements"
import { VRButton } from "three/examples/jsm/webxr/VRButton"

/**
 * List of session lifecycle and interaction events
 */
export const xrSessionEvents = ["sessionstart", "sessionend"]

/**
 * Modified three-game element for WebXR
 */
export class ThreeXRGame extends ThreeGame {
  /**
   * Fired when a XR session starts presenting
   */
  sessionstart?: string
  /**
   * Fired when a XR session ends presenting
   */
  sessionend?: string
  /**
   * A reference to a XR session button when enabled
   */
  button?: HTMLElement

  connectedCallback() {
    super.connectedCallback()

    // Configure renderer for WebXR
    this.autorender = true
    ;(this.renderer as THREE.WebGLRenderer).autoClear = true
    ;(this.renderer as THREE.WebGLRenderer).xr.enabled = true

    // Sync XR session to renderer pixel ratio
    ;(this.renderer as THREE.WebGLRenderer).xr.setFramebufferScaleFactor(
      (this.renderer as THREE.WebGLRenderer).pixelRatio
    )

    // Create VR button if specified
    if (this.hasAttribute("button")) {
      this.button = VRButton.createButton(this.renderer as THREE.WebGLRenderer)

      this.parentElement.appendChild(this.button)
    }

    // Setup session events
    xrSessionEvents.forEach((event) => {
      // Set initial event attributes
      if (!this[event] && this.hasAttribute(event)) {
        this[event] = new Function("event", this.getAttribute(event)).bind(this)
      }

      // Initialize session listeners
      const listener = this[event]

      if (listener) {
        ;(this.renderer as THREE.WebGLRenderer).xr.addEventListener(event, listener)
      }
    })
  }

  attributeChangedCallback(key, oldValue, newValue) {
    // If not an observed event, early return to base element
    if (!xrSessionEvents.includes(key)) {
      return super.attributeChangedCallback(key, oldValue, newValue)
    }

    // Cleanup old listeners
    if (oldValue) {
      const listener = this[key]
      ;(this.renderer as THREE.WebGLRenderer).xr.removeEventListener(key, listener)
    }

    // Add new listeners
    if (newValue) {
      const listener = (this[key] = new Function("event", newValue).bind(this))

      // Update session listeners
      ;(this.renderer as THREE.WebGLRenderer).xr.addEventListener(key, listener)
    }
  }
}

registerThreeElement("three-xr-game", "XRGame", ThreeXRGame)
