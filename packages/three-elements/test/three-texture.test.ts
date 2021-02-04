import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeElement } from "../src"

describe("the <three-texture> element", () => {
  describe("the `url` attribute", () => {
    it("loads a texture from the given URL", async () => {
      await fixture(html`
        <three-game>
          <three-scene>
            <three-mesh-standard-material>
              <three-texture url="test/textures/diffuse.jpg" attach="map"></three-texture>
            </three-mesh-standard-material>
          </three-scene>
        </three-game>
      `)

      const material = document.querySelector("three-mesh-standard-material") as ThreeElement
      const texture = document.querySelector("three-texture") as ThreeElement

      expect(material.object.map).to.eq(texture.object)
    })
  })
})
