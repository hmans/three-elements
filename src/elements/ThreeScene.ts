import { Color, Scene } from "three"
import { ThreeElement } from "../ThreeElement"

export class ThreeScene extends ThreeElement.for(Scene) {
  readyCallback() {
    const scene = this.object
    if (!scene) return

    scene.background = new Color("#ccc")
    console.log(scene)
    this.onupdate = (dt) => {
      this.game?.renderer.render(scene, this.game.camera)
    }
  }
}

customElements.define("three-scene", ThreeScene)
