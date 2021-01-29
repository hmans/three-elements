import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeElement } from "../src/ThreeElement"

describe("the args attribute", () => {
  const render = () =>
    fixture(html`
      <three-game>
        <three-scene>
          <three-mesh>
            <three-fog args="#333333, 1, 1000"></three-fog>
          </three-mesh>
        </three-scene>
      </three-game>
    `)

  it("provides the arguments for the Three.js constructor", async () => {
    const game = await render()
    const fog = game.querySelector("three-fog") as ThreeElement
    expect(fog.object.color.getHexString()).to.equal("333333")
  })
})
