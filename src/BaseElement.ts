import * as THREE from "three"
import { ThreeGame, TickerFunction } from "./elements/three-game"
import { ThreeScene } from "./elements/three-scene"
import { IConstructable } from "./types"

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

    const scene = this.findElementWithInstanceOf(THREE.Scene) as ThreeScene
    if (!scene) throw "No <three-scene> tag found!"
    return scene
  }

  /** A dictionary of ticker callbacks (ontick, etc.) */
  protected callbacks = {} as Record<string, TickerFunction | undefined>

  get ontick() {
    return this.callbacks["ontick"]
  }

  set ontick(fn: TickerFunction | string | undefined) {
    this.setCallback("ontick", fn)
  }

  get onlatetick() {
    return this.callbacks["onlatetick"]
  }

  set onlatetick(fn: TickerFunction | string | undefined) {
    this.setCallback("onlatetick", fn)
  }

  get onframetick() {
    return this.callbacks["onframetick"]
  }

  set onframetick(fn: TickerFunction | string | undefined) {
    this.setCallback("onframetick", fn)
  }

  get onrendertick() {
    return this.callbacks["onrendertick"]
  }

  set onrendertick(fn: TickerFunction | string | undefined) {
    this.setCallback("onrendertick", fn)
  }

  /**
   * Configures one of the available ticker callbacks.
   *
   * @param propName Name of the callback property (eg. `ontick`)
   * @param fn Callback function or string
   */
  protected setCallback(propName: string, fn?: TickerFunction | string) {
    const eventName = propName.replace(/^on/, "") as any

    /* Unregister previous callback */
    const previousCallback = this.callbacks[eventName]
    if (previousCallback) {
      this.game.emitter.off(eventName, previousCallback)
    }

    const createCallbackFunction = (fn?: TickerFunction | string) => {
      switch (typeof fn) {
        /* If the value is a string, we'll create a function from it. Magic! */
        case "string":
          return new Function(fn).bind(this) as TickerFunction

        /* If it's already a function, we'll just use that. */
        case "function":
          return (dt: number) => fn(dt, this)
      }
    }

    /* Store new value, constructing a function from a string if necessary */
    this.callbacks[eventName] = createCallbackFunction(fn)

    /* Register new callback */
    const newCallback = this.callbacks[eventName]
    if (newCallback) {
      /*
      We're using queueMicrotask here because at the point when a ticker event
      property is assigned, it's possible that the elements required to make this
      work are not done initializing yet.
      */
      queueMicrotask(() => {
        this.game.emitter.on(eventName, newCallback)
      })
    }
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

    /* Apply props */
    const attributes = this.getAllAttributes()
    for (const key in attributes) {
      this.attributeChangedCallback(key, "", attributes[key])
    }

    /* Emit connected event */
    this.dispatchEvent(new CustomEvent("connected", { bubbles: true, cancelable: false }))

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
      this.dispatchEvent(new CustomEvent("ready", { bubbles: true, cancelable: false }))
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

    /* Emit disconnected event */
    this.dispatchEvent(new CustomEvent("disconnected", { bubbles: true, cancelable: false }))

    /*
    If isConnected is false, this element is being removed entirely. In this case,
    we'll do some extra cleanup.
    */
    if (!this.isConnected) {
      queueMicrotask(() => {
        /* Remove event handlers */
        this.ontick = undefined
        this.onlatetick = undefined
        this.onframetick = undefined
        this.onrendertick = undefined

        /* Emit disconnected event */
        this.dispatchEvent(new CustomEvent("removed", { bubbles: true, cancelable: false }))

        /* Invoke removedCallback */
        this.removedCallback()
      })
    }
  }

  attributeChangedCallback(key: string, oldValue: string, newValue: string): boolean {
    this.debug("attributeChangedCallback", key, newValue)

    switch (key) {
      /* A bunch of known properties that we will assign directly */
      case "ontick":
      case "onlatetick":
      case "onframetick":
      case "onrendertick":
        this[key] = newValue
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
