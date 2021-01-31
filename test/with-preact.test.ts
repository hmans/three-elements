import { expect } from "@open-wc/testing"
import { h, render } from "preact"
import * as THREE from "three"
import "../src"
import { ThreeGame } from "../src"
import { ThreeElement } from "../src/ThreeElement"

describe("using with Preact", () => {
  it("works", () => {
    const Dodecahedron = () =>
      h("three-mesh", { position: [1, 2, 3] }, [
        h("three-dodecahedron-buffer-geometry", null),
        h("three-mesh-standard-material", { color: "hotpink" })
      ])

    const Game = () =>
      h("three-game", { autorender: true }, h("three-scene", {}, h(Dodecahedron, null)))

    render(h(Game, null), document.body)

    const game = document.querySelector("three-game") as ThreeGame
    expect(game).to.be.instanceOf(ThreeGame)
    expect(game.autorender).to.be.true

    const mesh = document.querySelector("three-mesh") as ThreeElement
    expect(mesh.object).to.be.instanceOf(THREE.Mesh)
    expect(mesh.object.position.x).to.eq(1)
    expect(mesh.object.position.y).to.eq(2)
    expect(mesh.object.position.z).to.eq(3)
  })
})
