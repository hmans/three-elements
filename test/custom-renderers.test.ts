import { expect, fixture, html, nextFrame } from "@open-wc/testing"
import * as THREE from "three"
import "../src"

import { ThreeElement, ThreeGame } from "../src"

describe("using custom renderers", () => {
  describe("when no custom renderer is configured", () => {
    const render = () =>
      fixture(html`
        <three-game>
          <three-scene></three-scene>
        </three-game>
      `)

    it("uses the default renderer", async () => {
      const game = (await render()) as ThreeGame
      expect(game.renderer).to.be.instanceOf(THREE.WebGLRenderer)
    })
  })

  describe("with a custom renderer configured", () => {
    const render = () =>
      fixture(html`
        <three-game>
          <three-web-gl-renderer xr.enabled id="renderer"></three-web-gl-renderer>
          <three-scene></three-scene>
        </three-game>
      `)

    it("automatically uses the custom renderer", async () => {
      const game = (await render()) as ThreeGame
      const renderer = game.querySelector("three-web-gl-renderer") as ThreeElement
      expect(renderer.object).to.be.instanceOf(THREE.WebGLRenderer)
      expect(renderer.object.xr.enabled).to.eq(true)
      expect(game.renderer).to.eq(renderer.object)
    })
  })
})
