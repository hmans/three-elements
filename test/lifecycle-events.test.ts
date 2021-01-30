import { expect, nextFrame } from "@open-wc/testing"
import "../src"

describe("lifecycle events", () => {
  describe("when an element connects", () => {
    it("dispatches a 'connected' event", async () => {
      const game = document.createElement("three-game")
      const scene = document.createElement("three-scene")

      let count = 0
      let event

      game.addEventListener("connected", (e) => {
        count++
        event = e
      })

      document.body.appendChild(game)
      game.appendChild(scene)

      expect(count).to.eq(1)
      expect(event.target).to.eq(scene)
      expect(event.bubbles).to.be.true
      expect(event.cancelable).to.be.false
    })
  })

  describe("when an element mounts", () => {
    it("dispatches a 'mounted' event", async () => {
      const game = document.createElement("three-game")
      const scene = document.createElement("three-scene")

      let count = 0
      let event

      game.addEventListener("mounted", (e) => {
        count++
        event = e
      })

      document.body.appendChild(game)
      game.appendChild(scene)

      await nextFrame()

      expect(count).to.eq(1)
      expect(event.target).to.eq(scene)
      expect(event.bubbles).to.be.true
      expect(event.cancelable).to.be.false
    })
  })
})
