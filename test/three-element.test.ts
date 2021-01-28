import { expect, html, nextFrame } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeElement } from "../src/ThreeElement"
import { renderWithinGame } from "./helpers"

describe("<three-*> powered by ThreeElement", () => {
  const renderMeshElement = () =>
    renderWithinGame<ThreeElement<THREE.Mesh>>(html`
      <three-mesh onclick="this.object.material.color.set('red')">
        <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
        <three-mesh-standard-material color="hotpink"></three-mesh-standard-material>
      </three-mesh>
    `)

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

    describe("the ...deg suffix", () => {
      it("converts the value to radians", async () => {
        const el = await renderMeshElement()

        el.setAttribute("rotation.x", "90deg")
        await nextFrame()
        expect(el.object.rotation.x).to.equal(Math.PI / 2)

        el.setAttribute("rotation.x", "-90deg")
        await nextFrame()
        expect(el.object.rotation.x).to.equal(Math.PI / -2)

        el.setAttribute("rotation.x", "0deg")
        await nextFrame()
        expect(el.object.rotation.x).to.equal(0)

        el.setAttribute("rotation.x", "-0.5deg")
        await nextFrame()
        expect(el.object.rotation.x).to.equal((Math.PI / 180) * -0.5)
      })

      it("works within lists", async () => {
        const el = await renderMeshElement()

        el.setAttribute("rotation", "90deg, 0, -90deg")
        await nextFrame()
        expect(el.object.rotation.x).to.equal(Math.PI / 2)
        expect(el.object.rotation.y).to.equal(0)
        expect(el.object.rotation.z).to.equal(Math.PI / -2)
      })
    })
  })

  describe("the `attach` attribute", () => {
    it("materials and geometries are automatically attaches even without an explicit `attach` attribute", async () => {
      const el = await renderMeshElement()

      const geometryElement = el.querySelector("three-dodecahedron-buffer-geometry") as ThreeElement
      const materialElement = el.querySelector("three-mesh-standard-material") as ThreeElement

      expect(geometryElement.object).to.equal(el.object.geometry)
      expect(materialElement.object).to.equal(el.object.material)
    })
  })
})
