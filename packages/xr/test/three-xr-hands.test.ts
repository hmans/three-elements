import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeXRHands } from "../src"

describe("three-xr-hands", () => {
  it("creates hand elements", async () => {
    await fixture(html`
      <three-game>
        <three-scene>
          <three-xr-hands />
        </three-scene>
      </three-game>
    `)

    const xrHands = document.querySelector("three-xr-hands") as ThreeXRHands

    expect(xrHands).to.be.instanceOf(ThreeXRHands)
  })

  it("receives hand attributes", async () => {
    await fixture(html`
      <three-game>
        <three-scene>
          <three-xr-hands path="path" profile="profile" />
        </three-scene>
      </three-game>
    `)

    const xrHands = document.querySelector("three-xr-hands") as ThreeXRHands

    expect(xrHands.path).to.equal("path")
    expect(xrHands.profile).to.equal("profile")
  })
})
