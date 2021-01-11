import * as THREE from "three"
import { Color, Scene } from "three"
import { registerElement } from "../util/registerElement"
import { Ticker } from "../util/Ticker"

export class ThreeGame extends HTMLElement {
  ticker = new Ticker()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ antialias: true })

  connectedCallback() {
    this.attachShadow({ mode: "open" })

    /* Set up renderer */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.shadowRoot!.appendChild(this.renderer.domElement)

    /* Set up camera */
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)

    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener("resize", this.handleWindowResize, false)

    /* Start ticker */
    this.ticker.start()
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    window.removeEventListener("resize", this.handleWindowResize, false)

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

registerElement("three-game", ThreeGame)
