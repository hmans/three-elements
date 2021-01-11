import * as THREE from "three"
import { Color, Scene } from "three"
import { registerElement } from "../util/registerElement"
import { Ticker } from "../util/Ticker"

export class ThreeGame extends HTMLElement {
  ticker = new Ticker()
  renderer = new THREE.WebGLRenderer({ antialias: true })

  connectedCallback() {
    this.attachShadow({ mode: "open" })

    /* Set up renderer */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.shadowRoot!.appendChild(this.renderer.domElement)

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
    /* Update canvas */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

registerElement("three-game", ThreeGame)
