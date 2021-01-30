import * as THREE from "three"
import { EventEmitter } from "../util/EventEmitter"
import { registerElement } from "../util/registerElement"

export type TickerFunction = (dt: number, el: HTMLElement) => any

export class ThreeGame extends HTMLElement {
  emitter = new EventEmitter()

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
    /* Stop ticking */
    this.stopTicking()

    /* Unregister event handlers */
    window.removeEventListener("resize", this.handleWindowResize, false)

    /* Remove canvas from page */
    this.cleanupRenderer()
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
      this.emitter.emit("update", dt)
      this.emitter.emit("lateUpdate", dt)

      /* Has a frame been requested? */
      if (this.frameRequested || this.autorender) {
        this.frameRequested = false

        /* If we know that we're rendering a frame, execute frame callbacks. */
        this.emitter.emit("frameUpdate", dt)

        /* Finally, emit render event. This will trigger scenes to render. */
        this.emitter.emit("render", dt)
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

registerElement("three-game", ThreeGame)
