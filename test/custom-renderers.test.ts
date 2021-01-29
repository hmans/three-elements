import { expect, fixture, html, nextFrame } from "@open-wc/testing"
import * as THREE from "three"
import "../src"

import { ThreeGame } from "../src"

describe("using custom renderers", () => {
  const render = () =>
    fixture(html`
      <three-game>
        <three-scene></three-scene>
      </three-game>
    `)

  describe("when no custom renderer is configured", () => {
    it("uses the default renderer", async () => {
      const game = (await render()) as ThreeGame
      expect(game.renderer).to.be.instanceOf(THREE.WebGLRenderer)
    })
  })
})
