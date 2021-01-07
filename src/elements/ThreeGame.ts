import * as THREE from "three"
import { Color } from "three"
import { Ticker } from "../util/Ticker"

export class ThreeGame extends HTMLElement {
  ticker = new Ticker()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()

  private handleWindowResizeListener = this.handleWindowResize.bind(this)

  connectedCallback() {
    this.attachShadow({ mode: "open" })

    /* Set up renderer */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.shadowRoot!.appendChild(this.renderer.domElement)

    /* Set up camera */
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)

    /* Configure scene */
    this.scene.background = new Color("#333")

    /* Handle window resizing */
    window.addEventListener("resize", this.handleWindowResizeListener, false)

    /* Start ticker */
    this.ticker.start((dt) => {
      this.renderer.render(this.scene, this.camera)
    })
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    window.removeEventListener("resize", this.handleWindowResizeListener, false)

    /* Remove canvas from page */
    this.shadowRoot!.removeChild(this.renderer.domElement)
  }

  handleWindowResize() {
    /* Update camera */
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    /* Update canvas */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

customElements.define("three-game", ThreeGame)
