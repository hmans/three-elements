import { ThreeElement } from "./ThreeElement"
import * as THREE from "three"

export class ThreeRendererElement<T extends THREE.Renderer> extends ThreeElement<T> {
  connectedCallback() {
    super.connectedCallback()

    console.log("Attaching renderer to game!")
    this.game!.renderer = this.object!
    console.log("Attached!")
  }
}
