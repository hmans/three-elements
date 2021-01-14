import { Group } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

const loadedUrls: Record<string, GLTF> = {}

export class ThreeGLTFAsset extends ThreeElement.for(Group) {
  static get observedAttributes() {
    return [...ThreeElement.observedAttributes, "url"]
  }

  public get url() {
    return this.getAttribute("url")
  }

  public set url(url) {
    if (url) {
      if (url in loadedUrls) {
        this.setupGLTF(loadedUrls[url])
      } else {
        const loader = new GLTFLoader()
        loader.load(url, (gltf) => {
          loadedUrls[url] = gltf
          this.setupGLTF(gltf)
        })
      }
    }
  }

  private setupGLTF(gltf: GLTF) {
    /* Create a copy of the GLTF just for this element */
    const scene = gltf.scene.clone(true)

    /* Apply shadow settings */
    scene.traverse((o3d) => {
      o3d.castShadow = this.object!.castShadow
      o3d.receiveShadow = this.object!.receiveShadow
    })

    /* Add the GLTF to our local group */
    this.object!.add(scene)

    /* And make sure a frame will be rendered */
    this.game.requestFrame()
  }
}

registerElement("three-gltf-asset", ThreeGLTFAsset)
