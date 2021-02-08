import { expect, fixture, html, oneEvent } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeGLTFAsset } from "../src"

describe("three-gltf-asset", () => {
  it("loads the specified GLTF", async () => {
    await fixture(html`
      <three-game>
        <three-scene>
          <three-gltf-asset url="/test/models/spaceship/spaceship05.gltf"></three-gltf-asset>
        </three-scene>
      </three-game>
    `)

    const el = document.querySelector("three-gltf-asset") as ThreeGLTFAsset

    expect(el).to.be.instanceOf(ThreeGLTFAsset)
    expect(el.object).to.be.instanceOf(THREE.Group)
    expect(el.loaded).to.be.false

    await oneEvent(el, "loaded")

    expect(el.loaded).to.be.true
    expect(el.object.children[0]).to.be.instanceOf(THREE.Object3D)
  })
})
