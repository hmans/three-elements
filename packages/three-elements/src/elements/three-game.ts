import * as THREE from "three"
import { BaseElement } from "../BaseElement"
import { EventEmitter } from "../util/EventEmitter"
import { registerThreeElement } from "../util/registerElement"

export type TickerFunction = (dt: number, el: HTMLElement) => any

export class ThreeGame extends HTMLElement {
  static get observedAttributes() {
    return ["observed"]
  }

  emitter = new EventEmitter()

  /* OBSERVER */

  /**
   * ThreeGame optionally allows the user to request it to use a MutationObserver
   * that will notify elements when their attributes have changed through any other
   * method than something invoking `setAttribute`. This typically only happens when
   * the user modifies an attribute in the devtools of their browser.
   *
   * Users wishing to be able to do this can just set the boolean attribute `observed`:
   *
   * `<three-game observed>`
   */
  protected observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        const element = mutation.target as BaseElement
        const name = mutation.attributeName!
        const newValue = element.getAttribute(name)

        if (newValue) element.attributeChangedCallback(name, null, newValue)
      }
    })
  })

  protected _observed = false

  get observed() {
    return this._observed
  }

  set observed(v) {
    /* Store value */
    this._observed = v

    /* React to the new value in a hopefully idempotent fashion */
    this.observer.disconnect()

    if (this._observed) {
      console.warn(
        "WARNING: You have enabled the `observed` attribute. This feature is intended for development only and should not be enabled in production projects, as it has a significant impact on performance."
      )

      this.observer.observe(this, {
        attributes: true,
        attributeOldValue: false,
        subtree: true,
        childList: true
      })
    }
  }

  /* RENDERER */

  get renderer() {
    return this._renderer
  }

  set renderer(v) {
    this.cleanupRenderer()
    this._renderer = v
    this.setupRenderer()
  }

  protected _renderer: THREE.Renderer = this.makeDefaultRenderer()

  /* OPTIMIZED RENDERING */

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

    /* Initialize renderer size */
    this.setupRenderer()

    /* Look out for some specific stuff connecting within our branch of the document */
    this.addEventListener("connected", (e) => {
      const target = e.target as HTMLElement & { object?: any }

      if (target) {
        /*
        Pick up renderers as they connect. We need to figure out if the originating element
        represents a Three.js renderer. This is made slightly difficult by renderers not
        having a common base class, and no `isRenderer` property being available. Time
        to get creative and just make a wild guess. :>
        */
        if (target.tagName.endsWith("-RENDERER") && (target as any).object.render) {
          this.renderer = target.object
        }
      }
    })

    /* Announce that we're ready */
    this.dispatchEvent(new Event("ready"))

    /* Start ticker */
    this.startTicking()
  }

  disconnectedCallback() {
    /* Stop observing */
    this.observer.disconnect()

    /* Stop ticking */
    this.stopTicking()

    /* Unregister event handlers */
    window.removeEventListener("resize", this.handleWindowResize, false)

    /* Remove canvas from page */
    this.cleanupRenderer()
  }

  attributeChangedCallback(key: string, _: string | null, value: string) {
    switch (key) {
      case "observed":
        this.observed = this.hasAttribute("observed")
        break
    }
  }

  protected setupRenderer() {
    this.shadowRoot!.appendChild(this.renderer.domElement)
    this.handleWindowResize()
  }

  protected cleanupRenderer() {
    this.shadowRoot!.removeChild(this.renderer.domElement)
  }

  protected makeDefaultRenderer() {
    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      stencil: true,
      depth: true
    })

    renderer.autoClear = false

    /* Configure color space */
    renderer.outputEncoding = THREE.sRGBEncoding

    /* Enable shadow map */
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    return renderer
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

  /* TICKING */

  /** Are we currently ticking? */
  protected _ticking = false

  /** The time delta since the last frame, in fractions of a second. */
  deltaTime = 0

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
      this.emitter.emit("late-tick", dt)

      /* Has a frame been requested? */
      if (this.frameRequested || this.autorender) {
        this.frameRequested = false

        /* If we know that we're rendering a frame, execute frame callbacks. */
        this.emitter.emit("frame-tick", dt)

        /* Finally, emit render event. This will trigger scenes to render. */
        this.emitter.emit("render-tick", dt)
      }
    }

    /*
    If we have a WebGLRenderer, we'll use its setAnimationLoop. Otherwise,
    we'll perform normal rAF-style ticking.
    */
    this._ticking = true

    if (this.renderer instanceof THREE.WebGLRenderer) {
      this.renderer.setAnimationLoop(tick)
    } else {
      const loop = () => {
        tick()
        if (this._ticking) requestAnimationFrame(loop)
      }

      loop()
    }
  }

  stopTicking() {
    this._ticking = false

    if (this.renderer instanceof THREE.WebGLRenderer) {
      this.renderer.setAnimationLoop(null)
    }
  }
}

registerThreeElement("three-game", "Game", ThreeGame)
