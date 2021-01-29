import { ThreeElement } from "./ThreeElement"
import * as THREE from "three"

export class ThreeRendererElement<T extends THREE.Renderer> extends ThreeElement<T> {
  connectedCallback() {
    super.connectedCallback()
    this.game!.renderer = this.object!
  }
}
