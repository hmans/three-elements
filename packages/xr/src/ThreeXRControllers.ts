import * as THREE from "three"
import { registerThreeElement } from "three-elements"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory"
import { BaseXRControllers } from "."

/**
 * WebXR element for default controllers
 */
export class ThreeXRControllers extends BaseXRControllers {
  createControllers() {
    // Create hand models
    const controllerModelFactory = new XRControllerModelFactory()

    // Add Joysticks
    const controllerGrip1 = (this.game.renderer as THREE.WebGLRenderer).xr.getControllerGrip(0)
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
    this.object.add(controllerGrip1)

    const controllerGrip2 = (this.game.renderer as THREE.WebGLRenderer).xr.getControllerGrip(1)
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
    this.object.add(controllerGrip2)
  }

  mountedCallback() {
    super.mountedCallback()

    this.createControllers()
  }
}

registerThreeElement("three-xr-controllers", "XRControllers", ThreeXRControllers)
