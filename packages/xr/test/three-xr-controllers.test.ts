import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeXRControllers } from "../src"

describe("three-xr-controllers", () => {
  it("creates controller elements", async () => {
    await fixture(html`
      <three-game>
        <three-scene>
          <three-xr-controllers />
        </three-scene>
      </three-game>
    `)

    const xrControllers = document.querySelector("three-xr-controllers") as ThreeXRControllers

    expect(xrControllers).to.be.instanceOf(ThreeXRControllers)
  })

  it("registers controller events", async () => {
    await fixture(html`
      <three-game>
        <three-scene>
          <three-xr-controllers
            connected="connected"
            select="select"
            selectstart="selectstart"
            selectend="selectend"
            squeeze="squeeze"
            squeezestart="squeezestart"
            squeezeend="squeezeend"
            disconnected="disconnected"
          />
        </three-scene>
      </three-game>
    `)

    const xrControllers = document.querySelector("three-xr-controllers") as ThreeXRControllers

    expect(typeof xrControllers.connected).to.equal("function")
    expect(typeof xrControllers.select).to.equal("function")
    expect(typeof xrControllers.selectstart).to.equal("function")
    expect(typeof xrControllers.selectend).to.equal("function")
    expect(typeof xrControllers.squeeze).to.equal("function")
    expect(typeof xrControllers.squeezestart).to.equal("function")
    expect(typeof xrControllers.disconnected).to.equal("function")
  })
})
