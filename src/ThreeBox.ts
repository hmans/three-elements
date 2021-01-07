import * as THREE from "three"
import { ThreeGame } from "./ThreeGame"

class ThreeBox extends HTMLElement {
  material: THREE.Material
  geometry: THREE.BufferGeometry
  mesh: THREE.Mesh

  constructor() {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: this.getAttribute("color") || "white" })
    this.geometry = new THREE.BoxBufferGeometry()
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  connectedCallback() {
    const game = this.parentElement as ThreeGame
    game.scene.add(this.mesh)
  }

  disconnectedCallback() {
    const game = this.parentElement as ThreeGame
    game.scene.remove(this.mesh)

    this.material.dispose()
    this.geometry.dispose()
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    switch (name) {
      case "rotation":
        this.mesh.rotation.z = newValue / 10
        break
      case "color":
        break
    }
  }

  static get observedAttributes() {
    return ["color", "rotation"]
  }
}

customElements.define("three-box", ThreeBox)
