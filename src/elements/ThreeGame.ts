import * as THREE from "three"
import { Color } from "three"

export class ThreeGame extends HTMLElement {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()

  private ticking = true
  private handleWindowResizeListener = this.handleWindowResize.bind(this)

  connectedCallback() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)

    window.addEventListener("resize", this.handleWindowResizeListener, false)

    this.scene.background = new Color("#333")

    const tick = () => {
      if (this.ticking) requestAnimationFrame(tick)
      this.renderer.render(this.scene, this.camera)
    }

    tick()
  }

  disconnectedCallback() {
    this.ticking = false
    window.removeEventListener("resize", this.handleWindowResizeListener, false)
    document.body.removeChild(this.renderer.domElement)
  }

  handleWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

customElements.define("three-game", ThreeGame)
