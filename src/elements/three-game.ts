import * as THREE from "three"
import { registerElement } from "../util/registerElement"
import EventEmitter from "eventemitter3"

export type TickerFunction = (dt: number) => any

export const CALLBACKS = new Set<string>(["onupdate", "onlateupdate", "onframe", "onrender"])

export class ThreeGame extends HTMLElement {
  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    stencil: true,
    depth: true
  })

  events = new EventEmitter()

  /** Is the ticker running? */
  private ticking = false

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

    /* We'll plug our canvas into the shadow root. */
    this.attachShadow({ mode: "open" })
    this.shadowRoot!.appendChild(this.renderer.domElement)

    /* Handle window resizing */
    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener("resize", this.handleWindowResize, false)

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
    /* Update canvas */
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    /* Emit event */
    this.events.emit("resize")
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

      /* Execute update and lateupdate callbacls. */
      this.events.emit("update", dt)
      this.events.emit("lateupdate", dt)

      /* Has a frame been requested? */
      if (this.frameRequested || this.autorender) {
        this.frameRequested = false

        /* If we know that we're rendering a frame, execute frame callbacks. */
        this.events.emit("frame", dt)

        /* Finally, emit render event. This will trigger scenes to render. */
        this.events.emit("render", dt)
      }

      /* Loop as long as this ticker is active. */
      if (this.ticking) requestAnimationFrame(tick)
    }

    this.ticking = true
    requestAnimationFrame(tick)
  }

  stopTicking() {
    this.ticking = false
  }
}

registerElement("three-game", ThreeGame)
