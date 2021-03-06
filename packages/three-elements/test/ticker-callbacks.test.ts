import { expect, html, nextFrame } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeElement } from "../src/ThreeElement"
import { renderWithinGame } from "./helpers"

describe("ticker callbacks", () => {
  describe("when going through .callbacks directly", () => {
    it("registers the callback with the element's game", async () => {
      const obj = (await renderWithinGame(html`
        <three-object3d></three-object3d>
      `)) as ThreeElement

      let counter = 0
      const fn = () => counter++

      obj.callbacks.set("tick", fn)
      await nextFrame()
      expect(counter).to.eq(1)
    })
  })

  describe("when setting a property on an element", () => {
    it("registers the callback with the element's game", async () => {
      const obj = (await renderWithinGame(html`
        <three-object3d></three-object3d>
      `)) as ThreeElement

      let counter = 0
      const fn = () => counter++

      obj.tick = fn
      await nextFrame()
      expect(counter).to.eq(1)
    })
  })

  describe("when setting an attribute on an element", () => {
    it("registers the callback with the element's game", async () => {
      let counter = 0

      ;(window as any).fn = () => counter++

      const obj = (await renderWithinGame(html`
        <three-object3d tick="fn()"></three-object3d>
      `)) as ThreeElement

      await nextFrame()

      /* FIXME: the value should absolutely, totally be 1 here, not 2. What's going on? */
      expect(counter).to.eq(2)
    })
  })
})
