import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeElement, ThreeScene } from "../src"

describe("the args attribute", () => {
  const render = () =>
    fixture(html`
      <three-game>
        <three-scene camera=".active">
          <three-perspective-camera class="active" position="5, 5, 50"></three-perspective-camera>
        </three-scene>
      </three-game>
    `)

  it("provides the arguments for the Three.js constructor", async () => {
    const game = await render()
    const scene = game.querySelector("three-scene") as ThreeScene
    const camera = game.querySelector("three-perspective-camera") as ThreeElement
    expect(scene.camera).to.eq(camera.object)
  })
})
