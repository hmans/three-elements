import { expect, fixture, html } from "@open-wc/testing"
import "../src"
import { ThreeElement } from "../src/ThreeElement"

describe("<three-*> powered by ThreeElement", () => {
  const render = () =>
    fixture(html`
      <three-game>
        <three-scene>
          <!-- resources -->
          <three-dodecahedron-buffer-geometry id="geometry"></three-dodecahedron-buffer-geometry>
          <three-mesh-standard-material
            id="material"
            color="hotpink"
          ></three-mesh-standard-material>

          <!-- something that's using the resources -->
          <three-mesh ref:geometry="#geometry" ref:material="#material"> </three-mesh>
        </three-scene>
      </three-game>
    `)

  it("is backed by ThreeElement", async () => {
    const group = await render()
    const mesh = group.querySelector("three-mesh") as ThreeElement
    const geometry = group.querySelector("three-dodecahedron-buffer-geometry") as ThreeElement
    const material = group.querySelector("three-mesh-standard-material") as ThreeElement

    expect(mesh.object.geometry).to.equal(geometry.object)
    expect(mesh.object.material).to.equal(material.object)
  })
})
