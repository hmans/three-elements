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

    const $gltf = document.querySelector("three-gltf-asset") as ThreeGLTFAsset

    expect($gltf).to.be.instanceOf(ThreeGLTFAsset)
    expect($gltf.object).to.be.instanceOf(THREE.Group)
    expect($gltf.loaded).to.be.false

    await oneEvent($gltf, "loaded")

    expect($gltf.loaded).to.be.true
    expect($gltf.object.children[0]).to.be.instanceOf(THREE.Object3D)
  })

  it("applies the object's layer to all nodes contained in the GLTF scene", async () => {
    await fixture(html`
      <three-game>
        <three-scene>
          <three-gltf-asset
            url="/test/models/spaceship/spaceship05.gltf"
            layers="8"
          ></three-gltf-asset>
        </three-scene>
      </three-game>
    `)

    const $gltf = document.querySelector("three-gltf-asset") as ThreeGLTFAsset

    await oneEvent($gltf, "loaded")

    /* We're going to test against another layers object. */
    const layers = new THREE.Layers()
    layers.set(8)

    expect($gltf.object.layers.test(layers)).to.be.true
    expect($gltf.object.children[0].layers.test(layers)).to.be.true
  })
})
