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
          <three-webgl-renderer xr.enabled></three-webgl-renderer>
          <three-scene></three-scene>
        </three-game>
      `)

    it("creates an element that wraps a renderer", async () => {
      const game = (await render()) as ThreeGame
      const renderer = game.querySelector("three-webgl-renderer") as ThreeElement

      expect(renderer.object).to.be.instanceOf(THREE.WebGLRenderer)
    })

    it("automatically attaches the custom renderer to the three-game element", async () => {
      const game = (await render()) as ThreeGame
      const renderer = game.querySelector("three-webgl-renderer") as ThreeElement

      expect(game.renderer).to.eq(renderer.object)
    })

    it("passes custom options to the renderer", async () => {
      const game = (await render()) as ThreeGame
      const renderer = game.querySelector("three-webgl-renderer") as ThreeElement

      expect(renderer.object.xr.enabled).to.eq(true)
    })
  })
})
