import { expect, fixture, html } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeXRGame } from "../src"

describe("three-xr-game", () => {
  it("enables WebXR", async () => {
    await fixture(html`<three-xr-game />`)

    const xrGame = document.querySelector("three-xr-game") as ThreeXRGame

    expect(xrGame).to.be.instanceOf(ThreeXRGame)
    expect((xrGame.renderer as THREE.WebGLRenderer).xr.enabled).to.be.true
  })

  it("creates a VR button", async () => {
    await fixture(html`<three-xr-game button />`)

    const xrGame = document.querySelector("three-xr-game") as ThreeXRGame

    expect(xrGame.button).to.be.instanceOf(HTMLElement)
  })

  it("registers session events", async () => {
    await fixture(html`<three-xr-game sessionstart="sessionstart" sessionend="sessionend" />`)

    const xrGame = document.querySelector("three-xr-game") as ThreeXRGame

    expect(typeof xrGame.sessionstart).to.equal("function")
    expect(typeof xrGame.sessionstart).to.equal("function")
  })
})
