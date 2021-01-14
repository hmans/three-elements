import * as THREE from "three"
import { ThreeGame, TickerFunction } from "./elements/three-game"
import { ThreeScene } from "./elements/three-scene"
import { IConstructable, isDisposable, IStringIndexable } from "./types"
import { applyProps } from "./util/applyProps"
import { eventForwarder } from "./util/eventForwarder"
import { observeAttributeChange } from "./util/observeAttributeChange"

export class ThreeElementLifecycleEvent extends CustomEvent<{}> {}

export class ThreeElement<T> extends HTMLElement {
  /** The THREE.* object managed by this element. */
  object?: T

  /** A dictionary of ticker callbacks (onupdate, etc.) */
  private callbacks = {} as Record<string, TickerFunction | undefined>

  /**
   * Returns this element's tag name, formatted as an actual HTML tag (eg. "<three-mesh>").
   */
  get htmlTagName() {
    return `<${this.tagName.toLowerCase()}>`
  }

  get onupdate() {
    return this.callbacks["onupdate"]
  }

  set onupdate(fn: TickerFunction | string | undefined) {
    this.setCallback("onupdate", fn)
  }

  get onlateupdate() {
    return this.callbacks["onlateupdate"]
  }

  set onlateupdate(fn: TickerFunction | string | undefined) {
    this.setCallback("onlateupdate", fn)
  }

  get onframe() {
    return this.callbacks["onframe"]
  }

  set onframe(fn: TickerFunction | string | undefined) {
    this.setCallback("onframe", fn)
  }

  get onrender() {
    return this.callbacks["onrender"]
  }

  set onrender(fn: TickerFunction | string | undefined) {
    this.setCallback("onrender", fn)
  }

  /**
   * Returns the instance of ThreeGame that this element is nested under.
   */
  get game(): ThreeGame {
    if (!this._game) {
      this._game = this.find((node) => node instanceof ThreeGame) as ThreeGame
      if (!this._game) throw "No <three-game> tag found!"
    }
    return this._game
  }
  private _game?: ThreeGame

  get ticking() {
    return this._ticking
  }
  set ticking(v) {
    this._ticking = v

    if (v) {
      this.debug("ticking is set; subscribing to game's ticker events")

      this.game.addEventListener("update" as any, this._forwarder)
      this.game.addEventListener("lateupdate" as any, this._forwarder)
      this.game.addEventListener("frame" as any, this._forwarder)
      this.game.addEventListener("render" as any, this._forwarder)
    } else {
      this.debug("Unregistering ticker listeners")

      this.game.removeEventListener("update" as any, this._forwarder)
      this.game.removeEventListener("lateupdate" as any, this._forwarder)
      this.game.removeEventListener("frame" as any, this._forwarder)
      this.game.removeEventListener("render" as any, this._forwarder)
    }
  }
  private _forwarder = eventForwarder(this)
  private _ticking = false

  /**
   * Returns the instance of ThreeScene that this element is nested under.
   */
  get scene(): ThreeScene {
    if (!this._scene) {
      this._scene = this.findElementWith(THREE.Scene) as ThreeScene
      if (!this._scene) throw "No <three-scene> tag found!"
    }
    return this._scene
  }
  private _scene?: ThreeScene

  constructor() {
    super()
    this.debug("constructor", this.getAllAttributes())
  }

  connectedCallback() {
    this.debug("connectedCallback")

    /* Store a reference to this element in the wrapped object's userData. */
    if (this.object instanceof THREE.Object3D) {
      this.object!.userData.threeElement = this
    }

    /* Apply props */
    this.handleAttributeChange(this.getAllAttributes())

    /*
    When one of this element's attributes changes, apply it to the object. Custom Elements have a built-in
    mechanism for this (attributeChangedCallback and observedAttributes, but unfortunately we can't use it,
    since we don't know the set of attributes the wrapped Three.js classes expose beforehand. So instead
    we're hacking our way around it using a mutation observer. Fun times!)
    */
    observeAttributeChange(this, (prop, value) => {
      this.handleAttributeChange({ [prop]: value })
    })

    /* Emit connected event */
    this.dispatchEvent(
      new ThreeElementLifecycleEvent("connected", { bubbles: true, cancelable: false })
    )

    /*
    Some stuff relies on all custom elements being fully defined and connected. However:

    If there are already tags in the DOM, newly created custom elements will connect in the order they
    are defined, which isn't always what we want (because a Material node that intends to attach itself to
    a Mesh might be defined before the element that represents that Mesh. Woops!)

    For this reason, we'll use a simple trick -- we will wait with the actual mounting until another tick
    has passed, by way of setTimeout.

    Yeah, I know. Crazy. But it solves the problem elegantly. Except that classes overloading
    connectedCallback() will need to remember doing this. But maybe we will find a better way in the future.

    Also see: https://javascript.info/custom-elements#rendering-order
    */
    setTimeout(() => {
      /* Handle attach attribute */
      this.handleAttach()

      /* Add object to scene */
      this.addObjectToScene()

      /* Make sure a frame is queued */
      this.game.requestFrame()

      /* Invoke mount method */
      this.readyCallback()

      /* Emit ready event */
      this.dispatchEvent(
        new ThreeElementLifecycleEvent("ready", { bubbles: true, cancelable: false })
      )

      this.debug("Object is ready:", this.object)
    })
  }

  readyCallback() {}

  disconnectedCallback() {
    this.debug("disconnectedCallback")

    /* Emit disconnected event */
    this.dispatchEvent(
      new ThreeElementLifecycleEvent("disconnected", { bubbles: true, cancelable: false })
    )

    /* Stop listening to the game's ticker events */
    this.ticking = false

    /* If the wrapped object is parented, remove it from its parent */
    if (this.object instanceof THREE.Object3D && this.object.parent) {
      this.debug("Removing from scene:", this.object)
      this.object.parent.remove(this.object)
    }

    /* If the object can be disposed, dispose of it! */
    if (isDisposable(this.object)) {
      this.debug("Disposing:", this.object)
      this.object.dispose()
    }
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
  find<T extends HTMLElement>(fn: (node: HTMLElement) => any) {
    /* Start here */
    let node: HTMLElement | undefined
    node = this

    do {
      /* Get the immediate parent, or, if we're inside a shaodow DOM, the host element */
      node = node.parentElement || (node.getRootNode() as any).host

      /* Check against the supplied function */
      if (node && fn(node)) {
        return node
      }
    } while (node)
  }

  findElementWith<T>(constructor: IConstructable<T>): ThreeElement<T> | undefined {
    return this.find(
      (node) => node instanceof ThreeElement && node.object instanceof constructor
    ) as ThreeElement<T> | undefined
  }

  private addObjectToScene() {
    /*
    If the wrapped object is an Object3D, add it to the scene. If we can find a parent somewhere in the
    tree above it, parent our object to that.
    */
    if (this.object instanceof THREE.Object3D && !(this.object instanceof THREE.Scene)) {
      const parent = this.findElementWith(THREE.Object3D)

      if (parent) {
        this.debug("Parenting under:", parent)
        parent.object!.add(this.object)
      } else {
        throw `Found no suitable parent for ${this.htmlTagName}. Did you forget to add a <three-scene> tag? 😢`
      }
    }
  }

  private handleAttach() {
    /* Use provided attach, or auto-set it based on the tag name. */
    let attach = this.getAttribute("attach")

    if (attach === null) {
      if (this.object instanceof THREE.Material) {
        attach = "material"
      } else if (
        this.object instanceof THREE.Geometry ||
        this.object instanceof THREE.BufferGeometry
      ) {
        attach = "geometry"
      } else if (this.object instanceof THREE.Fog) {
        attach = "fog"
      }
    }

    /* If the wrapped object has an "attach" attribute, automatically assign it to the
       value of the same name in the parent object. */
    if (attach) {
      const parent = this.parentElement

      if (!parent) {
        this.error(`Tried to attach to the "${attach} property, but there was no parent! 😢`)
        return
      } else if (parent instanceof ThreeElement) {
        this.debug("Attaching to:", parent)
        parent.object[attach!] = this.object
      } else {
        this.error(
          `Tried to attach to the "${attach} property of ${parent}, but it's not a ThreeElement! It's possible that the target element has not been upgraded to a ThreeElement yet. 😢`
        )
      }
    }
  }

  private handleAttributeChange(attributes: IStringIndexable) {
    const { attach, args, ticking, ...remainingAttributes } = attributes

    /*
    "ticking" will make the element subscribe to the game's ticker events.
    */
    if (ticking !== undefined) {
      this.ticking = ticking
    }

    /*
    When pointer event handlers are set as attributes, we'll construct new function from them. Typically,
    HTMLElement would already do this for us, but we're going to hook a bit of functionality in there, including making
    sure that a new frame is requested, and some convenient shortcuts.
    */
    for (const event of [
      "pointerdown",
      "pointerup",
      "pointerenter",
      "pointerleave",
      "pointerover",
      "pointerout",
      "click",
      "dblclick"
    ]) {
      const prop = `on${event}`
      const value = remainingAttributes[prop]
      if (value) {
        delete remainingAttributes[prop]
        const fun = new Function(`${value}; this.game.requestFrame()`).bind(this)
        Object.assign(this, { [prop]: () => fun(this, this.object) })
      }
    }

    /* Assign ticker callbacks. */
    for (const event of ["onupdate", "onlateupdate", "onframe", "onrender"]) {
      const value = remainingAttributes[event]

      if (value) {
        delete remainingAttributes[event]
        applyProps(this, { [event]: value })
      }
    }

    /* Assign everything else to the wrapped Three.js object */
    if (this.object) {
      applyProps(this.object, remainingAttributes)
    }

    /* Make sure a frame is queued */
    this.game.requestFrame()
  }

  private setCallback(propName: string, fn?: TickerFunction | string) {
    const eventName = propName.replace(/^on/, "") as any

    /* Unregister previous callback */
    const previousCallback = this.callbacks[eventName]
    if (previousCallback) {
      this.removeEventListener(eventName, previousCallback)
    }

    const createCallbackFunction = (fn?: TickerFunction | string) => {
      switch (typeof fn) {
        /*
        If the value is a string, we'll create a function from it. Magic!
        */
        case "string":
          return new Function("delta", `fun = ${fn}`, "fun(delta, this)").bind(this)

        /*
        If it's already a function, we'll do a bit of wrapping to make sure that both
        normal and arrow functions are supported. Normal functions can be bound to `this`,
        but arrow functions can't. In order to allow the use of arrow functions, we will
        pass `this` as a second argument after the deltatime.
        */
        case "function":
          return (dt: number) => fn.bind(this)(dt, this)
      }
    }

    /* Store new value, constructing a function from a string if necessary */
    this.callbacks[eventName] = createCallbackFunction(fn)

    /* Register new callback */
    const newCallback = this.callbacks[eventName]
    if (newCallback) {
      setTimeout(() => {
        this.ticking = true
        this.addEventListener(eventName, newCallback)
      })
    }
  }

  private debug(...output: any) {
    // console.debug(`${this.htmlTagName}`, ...output)
  }

  private error(...output: any) {
    console.error(`${this.htmlTagName}>`, ...output)
  }

  static for<T>(constructor: IConstructable<T>): IConstructable<ThreeElement<T>> {
    /*
      Create an anonymous class that inherits from our cool base class, but sets
      its own Three.js constructor property.
      */
    return class extends ThreeElement<T> {
      constructor() {
        super()

        /* Create managed object */
        const args = this.getAttribute("args")
        this.object = args ? new constructor(...JSON.parse(args)) : new constructor()
      }
    }
  }
}
