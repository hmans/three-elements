import { Group } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

export class ThreeGLTFAsset extends ThreeElement.for(Group) {
  static observedAttributes = ["url"]

  public get url() {
    return this.getAttribute("url")
  }

  public set url(url) {
    const loader = new GLTFLoader()

    if (url) {
      /*
      TODO: remove previously added GLTF to handle the case where the
      url attribute is changing
      */
      loader.load(url, (gltf) => {
        this.object!.add(gltf.scene)
        this.game.requestFrame()
      })
    }
  }
}

registerElement("three-gltf-asset", ThreeGLTFAsset)
