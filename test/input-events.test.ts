import { expect, html } from "@open-wc/testing"
import * as THREE from "three"
import "../src"
import { ThreeElement } from "../src/ThreeElement"
import { renderWithinGame } from "./helpers"

describe("input events", () => {
  describe("onclick", () => {
    it("triggers when the user clicks on the scene object", async () => {
      const el = await renderWithinGame<ThreeElement<THREE.Mesh>>(html`
        <three-mesh onclick="this.object.material.color.set('red')">
          <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
          <three-mesh-standard-material color="hotpink"></three-mesh-standard-material>
        </three-mesh>
      `)

      const material = el.object.material as THREE.MeshStandardMaterial

      expect(material).to.be.instanceof(THREE.MeshStandardMaterial)
      expect(material.color.getHexString()).to.equal("ff69b4")
      el.click()
      expect(material.color.getHexString()).to.equal("ff0000")
    })

    it("bubbles up to a parent group", async () => {
      let count = 0

      const group = await renderWithinGame<ThreeElement<THREE.Mesh>>(html`
        <three-group .onclick=${() => count++}>
          <three-mesh>
            <three-dodecahedron-buffer-geometry></three-dodecahedron-buffer-geometry>
            <three-mesh-standard-material color="hotpink"></three-mesh-standard-material>
          </three-mesh>
        </three-group>
      `)

      /* Click on the mesh */
      const mesh = group.querySelector("three-mesh") as HTMLElement
      mesh.click()

      /* The generated "onclick" event should have bubbled up to the group owning the mesh */
      expect(count).to.eq(1)
    })
  })
})
