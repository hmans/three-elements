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
  })
})
