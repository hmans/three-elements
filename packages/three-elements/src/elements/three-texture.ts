import { Texture, TextureLoader } from "three"
import { ThreeElement } from "../ThreeElement"
import { registerThreeElement } from "../util/registerElement"

export class ThreeTexture extends ThreeElement.for(Texture) {
  private _url?: string

  public get url() {
    return this._url
  }

  public set url(url) {
    /* If the URL has changed, initiate loading of texture. */
    if (this._url !== url) {
      /* Dispose any existing texture */
      this.object?.dispose()

      /* Set up a new texture object */
      if (url) {
        this.object = new TextureLoader().load(url)
      } else {
        this.object = new Texture()
      }
    }

    this._url = url
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
}

registerThreeElement("three-texture", "Texture", ThreeTexture)
