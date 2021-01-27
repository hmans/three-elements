import { expect, html, nextFrame } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeElement } from "../src/ThreeElement"
import { renderWithinGame } from "./helpers"

describe("<three-*> powered by ThreeElement", () => {
  const renderMeshElement = () =>
    renderWithinGame<ThreeElement<THREE.Mesh>>(html`<three-mesh></three-mesh>`)

  it("is backed by ThreeElement", async () => {
    const el = await renderMeshElement()
    expect(el).to.be.instanceOf(ThreeElement)
  })

  it("wraps a Three.js class", async () => {
    const el = await renderMeshElement()
    expect(el.object).to.be.instanceOf(THREE.Mesh)
  })

  describe("assigning to an attribute", () => {
    it("sets the wrapped object's property of the same name", async () => {
      const el = await renderMeshElement()

      expect(el.object.name).to.equal("")

      el.setAttribute("name", "A good mesh")
      await nextFrame()

      expect(el.object.name).to.equal("A good mesh")
    })

    it("supports dotty attributes (position.x)", async () => {
      const el = await renderMeshElement()
      el.object.position.x = 0
      expect(el.object.position.x).to.equal(0)

      el.setAttribute("position.x", "1")
      await nextFrame()

      expect(el.object.position.x).to.equal(1)
    })

    it("supports colon attributes (position:x)", async () => {
      const el = await renderMeshElement()

      el.object.position.x = 0
      expect(el.object.position.x).to.equal(0)

      el.setAttribute("position:x", "1")
      await nextFrame()

      expect(el.object.position.x).to.equal(1)
    })

    it("supports settable Vector3 attributes", async () => {
      const el = await renderMeshElement()

      el.object.position.set(0, 0, 0)
      expect(el.object.position.x).to.equal(0)
      expect(el.object.position.y).to.equal(0)
      expect(el.object.position.z).to.equal(0)

      el.setAttribute("position", "1, 2, 3")
      await nextFrame()

      expect(el.object.position.x).to.equal(1)
      expect(el.object.position.y).to.equal(2)
      expect(el.object.position.z).to.equal(3)
    })

    it("supports .setScalar attributes", async () => {
      const el = await renderMeshElement()

      el.object.scale.set(0, 0, 0)

      expect(el.object.scale.x).to.equal(0)
      expect(el.object.scale.y).to.equal(0)
      expect(el.object.scale.z).to.equal(0)

      el.setAttribute("scale", "1")
      await nextFrame()

      expect(el.object.scale.x).to.equal(1)
      expect(el.object.scale.y).to.equal(1)
      expect(el.object.scale.z).to.equal(1)
    })
  })
})
