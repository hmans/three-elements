import { ThreeGame, TickerFunction } from "./elements/three-game"
import { ThreeScene } from "./elements/three-scene"
import { TickerCallbacks } from "./TickerCallbacks"
import { IConstructor } from "./types"
import { applyPropWithDirective } from "./util/applyProps"
import { camelize } from "./util/camelize"

/**
 * The `BaseElement` class extends the built-in HTMLElement class with a bit of convenience
 * functionality, first and foremost in the addition of the `mountedCallback` and `removedCallback` hooks.
 * `BaseElement` knows how to hook into a scene and/or a game powered by three-elements, but otherwise doesn't
 * interact with Three.js in any way. You can use it as a base class for logic-only custom components that
 * need access to the game's ticker or renderer.
 */
export class BaseElement extends HTMLElement {
  /**
   * A list of properties that can also be set through attributes on the element's tag.
   * Attribute names are expected to be kebab-cased versions of the original
   * property names (eg. "renderTick" can be set through the attribute "render-tick".)
   */
  static exposedProperties = ["tick", "lateTick", "frameTick", "renderTick"]

  isMounted = false

  /**
   * Returns the instance of ThreeGame that this element is nested under.
   */
  get game(): ThreeGame {
    if (!this._game) this._game = this.findGame()
    return this._game
  }
  private _game?: ThreeGame

  private findGame() {
    if (!this.isConnected)
      throw "Something is accessing my .game property while I'm not connected. This shouldn't happen! 😭"

    const game = this.find((node) => node instanceof ThreeGame) as ThreeGame

    if (!game)
      throw "No <three-game> tag found! If you're seeing this error, it might be a sign that you're importing multiple versions of three-elements."

    return game
  }

  /**
   * Returns the instance of ThreeScene that this element is nested under.
   */
  get scene(): ThreeScene {
    if (!this._scene) this._scene = this.findScene()
    return this._scene
  }
  private _scene?: ThreeScene

  private findScene() {
    if (!this.isConnected)
      throw "Something is accessing my .scene property while I'm not connected. This shouldn't happen! 😭"

    const scene = this.find((node: any) => node.object?.isScene) as ThreeScene

    if (!scene) throw "No <three-scene> tag found!"

    return scene
  }

  /*** TICKER CALLBACKS ***/

  callbacks = new TickerCallbacks(this)

  get tick() {
    return this.callbacks.get("tick")
  }

  set tick(fn: TickerFunction | string | undefined) {
    this.callbacks.set("tick", fn)
  }

  get lateTick() {
    return this.callbacks.get("late-tick")
  }

  set lateTick(fn: TickerFunction | string | undefined) {
    this.callbacks.set("late-tick", fn)
  }

  get frameTick() {
    return this.callbacks.get("frame-tick")
  }

  set frameTick(fn: TickerFunction | string | undefined) {
    this.callbacks.set("frame-tick", fn)
  }

  get renderTick() {
    return this.callbacks.get("render-tick")
  }

  set renderTick(fn: TickerFunction | string | undefined) {
    this.callbacks.set("render-tick", fn)
  }

  constructor() {
    super()

    /* Bind some convenience functions to make it easier to destructure elements in tick event handlers. */
    this.requestFrame = this.requestFrame.bind(this)
  }

  /**
   * We're overloading setAttribute so it also invokes attributeChangedCallback. We
   * do this because we can't realistically make use of observedAttributes (since we don't
   * know at the time element classes are defined what properties their wrapped objects
   * are exposing.)
   */
  setAttribute(name: string, value: string) {
    this.attributeChangedCallback(name, this.getAttribute(name), value)
    super.setAttribute(name, value)
  }

  /**
   * This callback is invoked when the element is deemed properly initialized. Most
   * importantly, this happens in a microtask that is very likely executed after all
   * the other elements in the document have finished running their connectedCallbacks.
   */
  mountedCallback() {}

  /**
   * While disconnectedCallback is invoked whenever the element is removed from the DOM
   * _or_ just moved to a new parent, removedCallback will only be invoked when the
   * element is actually being removed from the DOM entirely.
   */
  removedCallback() {}

  connectedCallback() {
    this.debug("connectedCallback")

    /* Emit connected event */
    this.dispatchEvent(new Event("connected", { bubbles: true, cancelable: false }))

    /*
    Some stuff relies on all custom elements being fully defined and connected. However:

    If there are already tags in the DOM, newly created custom elements will connect in the order they
    are defined, which isn't always what we want (because a Material node that intends to attach itself to
    a Mesh might be defined before the element that represents that Mesh. Woops!)

    For this reason, we'll run some extra initialization inside a microtask:
    https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
    */
    queueMicrotask(() => {
      /* Apply all attributes */
      this.applyAllAttributes()

      /* Mount the component if this is our first time connecting */
      if (!this.isMounted) {
        this.isMounted = true
        this.mountedCallback()
        this.dispatchEvent(new Event("mounted", { bubbles: true, cancelable: false }))
      }
    })
  }

  /**
   * Helper method that will make sure all attributes set on the element are passed
   * through `attributeChangedCallback`. We mostly need this because of how we're
   * _not_ using `observedAttributes`.
   */
  applyAllAttributes() {
    for (const key of this.getAttributeNames()) {
      this.attributeChangedCallback(key, "", this.getAttribute(key))
    }
  }

  disconnectedCallback() {
    this.debug("disconnectedCallback")

    /*
    If isConnected is false, this element is being removed entirely. In this case,
    we'll do some extra cleanup.
    */
    if (!this.isConnected) {
      queueMicrotask(() => {
        /* Remove event handlers */
        this.tick = undefined
        this.lateTick = undefined
        this.frameTick = undefined
        this.renderTick = undefined

        /* Invoke removedCallback */
        this.removedCallback()
      })
    }
  }

  attributeChangedCallback(key: string, _: any, value: any): boolean {
    return applyPropWithDirective(this, camelize(key), value)
  }

  requestFrame() {
    this.game.requestFrame()
  }

  /**
   * Takes a function, then walks up the node tree and returns the first
   * node where the function returns true.
   */
  find<T extends HTMLElement>(fn: (node: HTMLElement) => any): T | undefined {
    /* TODO: We might be able to replace this entire function with something like this.closest(). */

    /* Start here */
    let node: HTMLElement | undefined
    node = this

    do {
      /* Get the immediate parent, or, if we're inside a shaodow DOM, the host element */
      node = node.parentElement || (node.getRootNode() as any).host

      /* Check against the supplied function */
      if (node && fn(node)) {
        return node as T
      }
    } while (node)
  }

  findElementWithInstanceOf<T = HTMLElement>(constructor: IConstructor): T | undefined {
    return this.find((node: any) => node.object instanceof constructor) as T | undefined
  }

  /**
   * Returns this element's tag name, formatted as an actual HTML tag (eg. "<three-mesh>").
   */
  get htmlTagName() {
    return `<${this.tagName.toLowerCase()}>`
  }

  protected debug(...output: any) {
    // console.debug(`${this.htmlTagName}`, ...output)
  }

  protected error(...output: any) {
    console.error(`${this.htmlTagName}>`, ...output)
  }
}
