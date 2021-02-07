import { Group } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ThreeElement } from "../ThreeElement"
import { registerThreeElement } from "../util/registerElement"

const loadedUrls: Record<string, GLTF> = {}

export class ThreeGLTFAsset extends ThreeElement.for(Group) {
  protected _url?: string

  public get url() {
    return this._url
  }

  public set url(url) {
    if (url != this._url) {
      this._url = url

      /* Clear this group */
      this.object?.clear()

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
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "url":
        this.url = newValue
        return true
      default:
        return super.attributeChangedCallback(name, oldValue, newValue)
    }
  }

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
