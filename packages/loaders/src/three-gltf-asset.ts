import { Group } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ThreeElement, registerThreeElement } from "three-elements"

const loader = new GLTFLoader()

export class ThreeGLTFAsset extends ThreeElement.for(Group) {
  /**
   * Has the GLTF been loaded?
   */
  loaded = false

  /**
   * URL of the GLTF to load.
   */
  public get url() {
    return this._url
  }

  public set url(url) {
    /* Only act if the URL has changed. */
    if (url != this._url) {
      this._url = url

      /* Clear this group */
      this.object?.clear()
      this.loaded = false

      if (url) {
        loader.load(url, (gltf) => {
          this.loaded = true
          this.dispatchEvent(new Event("loaded", { bubbles: false, cancelable: false }))
          this.setupGLTF(gltf)
        })
      }
    }
  }

  protected _url?: string

  private setupGLTF(gltf: GLTF) {
    /* Create a copy of the GLTF just for this element */
    const scene = gltf.scene.clone(true)

    /* Apply shadow settings */
    scene.traverse((node) => {
      node.castShadow = this.object!.castShadow
      node.receiveShadow = this.object!.receiveShadow
    })

    /* Add the GLTF to our local group */
    this.object!.add(scene)

    /* And make sure a frame will be rendered */
    this.game.requestFrame()
  }
}

registerThreeElement("three-gltf-asset", "GLTFAsset", ThreeGLTFAsset)
