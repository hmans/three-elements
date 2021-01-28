import { expect, fixture, html } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeGame } from "../src/elements/three-game"
import { EventEmitter } from "../src/util/EventEmitter"

describe("<three-game>", () => {
  const render = (): Promise<ThreeGame> => fixture(html`<three-game></three-game>`)

  it("works", async () => {
    const el = await render()
    expect(el.constructor.name).to.equal("ThreeGame")
  })

  it("provides a `renderer` property that is a WebGLRenderer instance", async () => {
    const el = await render()
    expect(el.renderer).to.be.instanceOf(THREE.WebGLRenderer)
  })

  it("provides an `emitter` property that is an EventEmitter instance", async () => {
    const el = await render()
    expect(el.emitter).to.be.instanceOf(EventEmitter)
  })

  describe("`xr` attribute", () => {
    it("enables WebXR features on the renderer", async () => {
      const el = (await fixture(html`<three-game xr></three-game>`)) as ThreeGame
      expect(el.renderer.xr.enabled).to.equal(true)
    })
  })

  describe("`autorender` attribute", () => {
    it("enables autorendering", async () => {
      const el = (await fixture(html`<three-game autorender></three-game>`)) as ThreeGame
      expect(el.autorender).to.equal(true)
    })
  })
})
