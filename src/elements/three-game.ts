import * as THREE from "three"
import { ThreeElement } from "../ThreeElement"
import { registerElement } from "../util/registerElement"

export type TickerFunction = (dt: number, element?: ThreeElement<any>) => any

export class TickerEvent extends CustomEvent<{ dt: number }> {}

export class ThreeGame extends HTMLElement {
  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    stencil: true,
    depth: true
  })

  /** Is the ticker running? */
  private ticking = false

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
  }

  requestFrame() {
    this.frameRequested = true
  }

  startTicking() {
    let lastNow = performance.now()

    const dispatch = (name: string, dt: number) =>
      this.dispatchEvent(
        new TickerEvent(name, { bubbles: false, cancelable: false, detail: { dt } })
      )

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
      dispatch("tick", dt)
      dispatch("latetick", dt)

      /* Has a frame been requested? */
      if (this.frameRequested || this.autorender) {
        this.frameRequested = false

        /* If we know that we're rendering a frame, execute frame callbacks. */
        dispatch("frametick", dt)

        /* Finally, emit render event. This will trigger scenes to render. */
        dispatch("rendertick", dt)
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
