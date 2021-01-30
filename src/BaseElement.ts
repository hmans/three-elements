import { ThreeGame, TickerFunction } from "./elements/three-game"
import { ThreeScene } from "./elements/three-scene"
import { TickerCallbacks } from "./TickerCallbacks"
import { IConstructable } from "./types"
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
   * Returns the instance of ThreeGame that this element is nested under.
   */
  get game(): ThreeGame {
    return (this._game ||= this.findGame())
  }
  private _game?: ThreeGame

  private findGame() {
    if (!this.isConnected)
      throw "Something is accessing my .game property while I'm not connected. This shouldn't happen! 😭"

    const game = this.find((node) => node instanceof ThreeGame) as ThreeGame
    if (!game) throw "No <three-game> tag found!"
    return game
  }

  /**
   * Returns the instance of ThreeScene that this element is nested under.
   */
  get scene(): ThreeScene {
    return (this._scene ||= this.findScene())
  }
  private _scene?: ThreeScene

  private findScene() {
    if (!this.isConnected)
      throw "Something is accessing my .scene property while I'm not connected. This shouldn't happen! 😭"

    const scene = this.find((node: any) => node.object?.isScene) as ThreeScene
    if (!scene) throw "No <three-scene> tag found!"
    return scene
  }

  callbacks = new TickerCallbacks(this)

  get tickUpdate() {
    return this.callbacks.get("update")
  }

  set tickUpdate(fn: TickerFunction | string | undefined) {
    this.callbacks.set("update", fn)
  }

  get tickLateUpdate() {
    return this.callbacks.get("lateUpdate")
  }

  set tickLateUpdate(fn: TickerFunction | string | undefined) {
    this.callbacks.set("lateUpdate", fn)
  }

  get tickFrameUpdate() {
    return this.callbacks.get("frameUpdate")
  }

  set tickFrameUpdate(fn: TickerFunction | string | undefined) {
    this.callbacks.set("frameUpdate", fn)
  }

  get tickRender() {
    return this.callbacks.get("render")
  }

  set tickRender(fn: TickerFunction | string | undefined) {
    this.callbacks.set("render", fn)
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
    this.attributeChangedCallback(name, this.getAttribute(name)!, value)
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

      /* Invoke mount method */
      this.mountedCallback()

      /* Emit ready event */
      this.dispatchEvent(new Event("mounted", { bubbles: true, cancelable: false }))
    })
  }

  applyAllAttributes() {
    const attributes = this.getAllAttributes()
    for (const key in attributes) {
      this.attributeChangedCallback(key, "", attributes[key])
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
        this.tickUpdate = undefined
        this.tickLateUpdate = undefined
        this.tickFrameUpdate = undefined
        this.tickRender = undefined

        /* Invoke removedCallback */
        this.removedCallback()
      })
    }
  }

  attributeChangedCallback(key: string, _: string, value: string): boolean {
    this.debug("attributeChangedCallback", key, value)

    /* Automatically map all tick-* attributes to their corresponding properties. */
    if (key.startsWith("tick-")) {
      const propName = camelize(key)
      if (propName in this) (this[propName as keyof this] as any) = value
      else
        console.error(
          `"${key}" was mapped to propert "${propName}", which is not a valid property on this element. `
        )
      return true
    }

    return false
  }

  /**
   * Returns a dictionary containing all attributes on this element.
   */
  getAllAttributes() {
    return this.getAttributeNames().reduce((acc, name) => {
      acc[name] = this.getAttribute(name)
      return acc
    }, {} as Record<string, any>)
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

  findElementWithInstanceOf<T = HTMLElement>(constructor: IConstructable): T | undefined {
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
