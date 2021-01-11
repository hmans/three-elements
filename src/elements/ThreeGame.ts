import * as THREE from "three"
import { registerElement } from "../util/registerElement"
import EventEmitter from "eventemitter3"

export type TickerFunction = (dt: number) => any
export type CallbackKind = "onupdate" | "onlateupdate" | "onframe" | "onrender"

export const CALLBACKS = new Set<CallbackKind>(["onupdate", "onlateupdate", "onframe", "onrender"])

export class ThreeGame extends HTMLElement {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  events = new EventEmitter()

  private ticking = false

  connectedCallback() {
    this.attachShadow({ mode: "open" })

    /* Set up renderer */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
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

  handleWindowResize() {
    /* Update canvas */
    this.renderer.setSize(window.innerWidth, window.innerHeight)
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

      /* If we know that we're rendering a frame, execute frame callbacks. */
      this.events.emit("frame", dt)

      /* Finally, emit render event. This will trigger scenes to render. */
      this.events.emit("render", dt)

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
