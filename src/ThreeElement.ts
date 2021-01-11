import * as THREE from "three"
import { Scene } from "three"
import { ThreeGame } from "./elements/ThreeGame"
import { ThreeScene } from "./elements/ThreeScene"
import { IConstructable, isDisposable, IStringIndexable } from "./types"
import { applyProps } from "./util/applyProps"
import { observeAttributeChange } from "./util/observeAttributeChange"
import { CallbackKind, CALLBACKS, TickerFunction } from "./util/Ticker"

export class ThreeElement<T> extends HTMLElement {
  /** The THREE.* object managed by this element. */
  object?: T

  /** A dictionary of ticker callbacks (onupdate, etc.) */
  private callbacks = {} as Record<CallbackKind, TickerFunction | undefined>

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
    if (!this._game) this._game = this.find((node) => node instanceof ThreeGame) as ThreeGame
    return this._game
  }
  private _game?: ThreeGame

  /**
   * Returns the instance of ThreeScene that this element is nested under.
   */
  get scene(): ThreeScene {
    if (!this._scene) this._scene = this.findElementWith(Scene) as ThreeScene
    return this._scene
  }
  private _scene?: ThreeScene

  constructor() {
    super()
    this.debug("constructor", this.getAllAttributes())
  }

  connectedCallback() {
    this.debug("connectedCallback")

    /*
    If there already is an onupdate, onlateupdate etc. available at this point, before we've
    handled the attributes of this element, it must be an instance method of a derived class,
    so let's register it as our callback.
    */
    for (const kind of CALLBACKS) {
      const callback = this[kind]
      if (typeof callback === "function") {
        this.setCallback(kind, callback.bind(this))
      }
    }

    /* Apply props */
    this.handleAttributes(this.getAllAttributes())

    /*
    When one of this element's attributes changes, apply it to the object. Custom Elements have a built-in
    mechanism for this (attributeChangedCallback and observedAttributes, but unfortunately we can't use it,
    since we don't know the set of attributes the wrapped Three.js classes expose beforehand. So instead
    we're hacking our way around it using a mutation observer. Fun times!)
    */
    observeAttributeChange(this, (prop, value) => {
      this.handleAttributes({ [prop]: value })
    })

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

      /* Invoke mount method */
      this.readyCallback()
    })
  }

  readyCallback() {}

  disconnectedCallback() {
    /* Unregister event handlers */
    if (this.game) {
      for (const kind of CALLBACKS) {
        if (this.callbacks[kind]) {
          this.game.ticker.removeCallback(kind, this.callbacks[kind]!)
          this.callbacks[kind] = undefined
        }
        this[kind] = undefined
      }
    }

    /* If the wrapped object is parented, remove it from its parent */
    if (this.object instanceof THREE.Object3D && this.object.parent) {
      this.object.parent.remove(this.object)
    }

    /* If the object can be disposed, dispose of it! */
    if (isDisposable(this.object)) {
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
        this.error(
          `Found no suitable parent for ${this.htmlTagName}. Did you forget to add a <three-scene> tag? 😢`
        )
      }
    }
  }

  private handleAttach() {
    /* Use provided attach, or auto-set it based on the tag name. */
    let attach = this.getAttribute("attach")

    if (attach === null && this.tagName.endsWith("-MATERIAL")) {
      attach = "material"
    } else if (attach === null && this.tagName.endsWith("-GEOMETRY")) {
      attach = "geometry"
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

  private handleAttributes(attributes: IStringIndexable) {
    const {
      attach,
      args,
      onupdate,
      onlateupdate,
      onrender,
      ...wrappedObjectAttributes
    } = attributes

    /* Assign some attributes to the element itself */
    applyProps(this, { onupdate, onlateupdate, onrender })

    /* Assign everything else to the wrapped Three.js object */
    if (this.object) {
      applyProps(this.object, wrappedObjectAttributes)
    }
  }

  private setCallback(kind: CallbackKind, fn?: TickerFunction | string) {
    /* Unregister previous callback */
    if (this.callbacks[kind]) {
      this.game!.ticker.removeCallback(kind, this.callbacks[kind]!)
    }

    /* Store new value, constructing a function from a string if necessary */
    this.callbacks[kind] =
      typeof fn === "string"
        ? new Function("delta", `fun = ${fn}`, "fun(delta, this)").bind(this.object)
        : fn

    /* Register new callback */
    if (this.callbacks[kind]) {
      this.game!.ticker.addCallback(kind, this.callbacks[kind]!)
    }
  }

  private debug(...output: any) {
    // console.debug(`${this.htmlTagName}>`, ...output)
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
