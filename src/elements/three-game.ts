import * as THREE from "three"
import { EventEmitter } from "../util/EventEmitter"
import { registerElement } from "../util/registerElement"

export type TickerFunction = (dt: number, el: HTMLElement) => any

export class ThreeGame extends HTMLElement {
  emitter = new EventEmitter()

  renderer: THREE.Renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    stencil: true,
    depth: true
  })

  /** The time delta since the last frame, in fractions of a second. */
  deltaTime = 0

  /** Has a frame been requested to be rendered in the next tick? */
  private frameRequested = true

  get autorender() {
    return this.hasAttribute("autorender")
  }

  set autorender(v) {
    if (v) this.setAttribute("autorender", "")
    else this.removeAttribute("autorender")
  }

  connectedCallback() {
    /* Set up renderer */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false

    /* Configure color space */
    this.renderer.outputEncoding = THREE.sRGBEncoding

    /* Enable shadow map */
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    /* Configure WebXR */
    this.renderer.xr.enabled = Boolean(this.hasAttribute("xr"))

    /* We'll plug our canvas into the shadow root. */
    const shadow = this.attachShadow({ mode: "open" })
    shadow.appendChild(this.renderer.domElement)

    /* Also apply some default styles. */
    const style = document.createElement("style")
    style.textContent = `:host {
      width: 100%;
      height: 100%;
      display: block;
    }`
    shadow.append(style)

    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener("resize", this.handleWindowResize, false)

    /* Initialize window size */
    this.handleWindowResize()

    /* Announce that we're ready */
    this.dispatchEvent(new Event("ready"))

    /* Start ticker */
    this.startTicking()
  }

  disconnectedCallback() {
    /* Stop ticking */
    this.stopTicking()

    /* Unregister event handlers */
    window.removeEventListener("resize", this.handleWindowResize, false)

    /* Remove canvas from page */
    this.shadowRoot!.removeChild(this.renderer.domElement)
  }

  private handleWindowResize() {
    /* Get width and height from this very element */
    const width = this.clientWidth
    const height = this.clientHeight

    /* Update canvas */
    this.renderer.setSize(width, height)

    /* Notify listeners */
    this.emitter.emit("resize", { width, height })
  }

  requestFrame() {
    this.frameRequested = true
  }

  startTicking() {
    let lastNow = performance.now()

    const tick = () => {
      /*
      Figure out deltatime. This is a very naive way of doing this, we'll eventually
      replace it with a better one.
      */
      const now = performance.now()
      const dt = (now - lastNow) / 1000
      lastNow = now

      /* Store deltaTime on instance for easy access */
      this.deltaTime = dt

      /* Execute tick and latetick events. */
      this.emitter.emit("tick", dt)
      this.emitter.emit("latetick", dt)

      /* Has a frame been requested? */
      if (this.frameRequested || this.autorender) {
        this.frameRequested = false

        /* If we know that we're rendering a frame, execute frame callbacks. */
        this.emitter.emit("frametick", dt)

        /* Finally, emit render event. This will trigger scenes to render. */
        this.emitter.emit("rendertick", dt)
      }
    }

    this.renderer.setAnimationLoop(tick)
  }

  stopTicking() {
    this.renderer.setAnimationLoop(null)
  }
}

registerElement("three-game", ThreeGame)
