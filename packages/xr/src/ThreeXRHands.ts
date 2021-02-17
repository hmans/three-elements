import * as THREE from "three"
import { registerThreeElement } from "three-elements"
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory"
import { BaseXRControllers } from "."

const observedAttributes = ["path", "profile"]

/**
 * WebXR element for hand controllers
 */
export class ThreeXRHands extends BaseXRControllers {
  /**
   * Path to XR hand models
   */
  path: string
  /**
   * XR hand model profile
   */
  profile: "spheres" | "boxes" | "oculus" | string

  updateHands() {
    // Cleanup old hands
    if (Array.from(this.children).length > 0) {
      Array.from(this.children).forEach((child) => this.removeChild(child))
    }

    // Update hand properties
    this.path = this.getAttribute("path") || "https://threejs.org/examples/models/fbx/"
    this.profile = this.getAttribute("profile") || "oculus"

    // Create hand models
    const handModelFactory = (new XRHandModelFactory() as any).setPath(this.path)

    // Configure hand models
    const handProfile = this.profile === "oculus_lowpoly" ? "oculus" : this.profile
    const options = this.profile === "oculus_lowpoly" ? { model: "lowpoly" } : undefined

    // Add Hands
    const hand1 = (this.game.renderer as THREE.WebGLRenderer).xr.getHand(0)
    hand1.add(handModelFactory.createHandModel(hand1, handProfile, options))
    this.object.add(hand1)

    const hand2 = (this.game.renderer as THREE.WebGLRenderer).xr.getHand(1)
    hand2.add(handModelFactory.createHandModel(hand2, handProfile, options))
    this.object.add(hand2)
  }

  mountedCallback() {
    super.mountedCallback()

    // Create hands on mount
    this.updateHands()
  }

  attributeChangedCallback(key, oldValue, newValue) {
    if (!observedAttributes.includes(key)) {
      return super.attributeChangedCallback(key, oldValue, newValue)
    }

    // Update hands on attribute change
    this.updateHands()
  }
}

registerThreeElement("three-xr-hands", "XRHands", ThreeXRHands)
