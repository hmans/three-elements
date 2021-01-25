import * as THREE from "three"
import { ThreeGame, TickerFunction } from "./elements/three-game"
import { ThreeScene } from "./elements/three-scene"
import { IConstructable, isDisposable, IStringIndexable } from "./types"
import { applyProps } from "./util/applyProps"
import { camelize } from "./util/camelize"
import { eventForwarder } from "./util/eventForwarder"
import { observeAttributeChange } from "./util/observeAttributeChange"

export class ThreeElementLifecycleEvent extends CustomEvent<{}> {}

export class ThreeElement<T = any> extends HTMLElement {
  static get observedAttributes(): string[] {
    return []
  }

  /** Has the element been fully initialized? */
  isReady = false

  /** Constructor that will instantiate our object. */
  static threeConstructor?: IConstructable

  /** The THREE.* object managed by this element. */
  get object() {
    return (this._object ||= this.constructWrappedObject())
  }

  private _object?: T

  protected constructWrappedObject() {
    const constructor = (this.constructor as typeof ThreeElement).threeConstructor

    if (constructor) {
      this.debug("Creating wrapped object instance")

      /* Create managed object */
      const args = this.getAttribute("args")
      if (args) {
        const parsed = JSON.parse(args)
        return new constructor(...(Array.isArray(parsed) ? parsed : [parsed]))
      } else {
        return new constructor()
      }
    }
  }

  /**
   * Returns this element's tag name, formatted as an actual HTML tag (eg. "<three-mesh>").
   */
  get htmlTagName() {
    return `<${this.tagName.toLowerCase()}>`
  }

  /** A dictionary of ticker callbacks (ontick, etc.) */
  private callbacks = {} as Record<string, TickerFunction | undefined>

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
   * Returns the instance of ThreeGame that this element is nested under.
   */
  get game(): ThreeGame {
    return (this._game ||= this.findGame())
  }
  private _game?: ThreeGame

  protected findGame() {
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

  protected findScene() {
    const scene = this.findElementWith(THREE.Scene) as ThreeScene
    if (!scene) throw "No <three-scene> tag found!"
    return scene
  }

  /** Is this element connected to the game's ticker? */
  get ticking() {
    return this._ticking
  }
  set ticking(v: boolean | string) {
    this._ticking = !!v || v === ""

    if (this._ticking) {
      this.debug("ticking is set; subscribing to game's ticker events")

      this.game.addEventListener("tick", this._forwarder)
      this.game.addEventListener("latetick", this._forwarder)
      this.game.addEventListener("frametick", this._forwarder)
      this.game.addEventListener("rendertick", this._forwarder)
    } else {
      this.debug("Unregistering ticker listeners")

      this.game.removeEventListener("tick", this._forwarder)
      this.game.removeEventListener("latetick", this._forwarder)
      this.game.removeEventListener("frametick", this._forwarder)
      this.game.removeEventListener("rendertick", this._forwarder)
    }
  }
  private _forwarder = eventForwarder(this)
  private _ticking = false

  /** This element's MutationObserver. */
  private _observer?: MutationObserver

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
    this._observer = observeAttributeChange(this, (prop, value) => {
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

      this.isReady = true

      this.debug("isReady:", this.object)
    })
  }

  readyCallback() {}

  disconnectedCallback() {
    this.debug("disconnectedCallback")

    /* Disconnect observer */
    this._observer?.disconnect()

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

    /* Queue a frame, because very likely something just disappeared from the scene :) */
    this.game.requestFrame()
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
    /* TODO: We might be able to replace this entire function with something like this.closest(). */

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

  requestFrame() {
    this.game.requestFrame()
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

  attributeChangedCallback(key: string, oldValue: any, newValue: any) {
    this.debug("attributeChangedCallback", key, newValue)

    switch (key) {
      /* NOOPs */
      case "args":
      case "id":
        break

      /* A bunch of known properties that we will assign directly */
      case "ticking":
      case "ontick":
      case "onlatetick":
      case "onframetick":
      case "onrendertick":
        this[key] = newValue
        break

      /* Event handlers that we will want to convert into a function first */
      case "onpointerdown":
      case "onpointerup":
      case "onpointerenter":
      case "onpointerleave":
      case "onpointerover":
      case "onpointerout":
      case "onclick":
      case "ondblclick":
        this[key] = new Function(newValue).bind(this)
        break

      /*
      If we've reached this point, we're dealing with an attribute that we don't know.
      */
      default:
        /*
        First of all, let's see if we're observing the attribute (as a child class may do.)
        This is just a cheap way to find out if the class is actually interested in having this
        property set as an attribute, so we don't randomly just overwrite _any_ property.
        */
        if ((this.constructor as any).observedAttributes.includes(key)) {
          const camelKey = camelize(key)
          this[camelKey as keyof this] = newValue
        } else {
          /*
          Okay, at this point, we'll just assume that the property lives on the wrapped object.
          Good times! Let's assign it directly.
          */
          if (this.object) {
            applyProps(this.object, { [key]: newValue })
          }
        }
    }
  }

  private handleAttributeChange(attributes: IStringIndexable) {
    for (const key in attributes) {
      this.attributeChangedCallback(key, null, attributes[key])
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
        /* If the value is a string, we'll create a function from it. Magic! */
        case "string":
          return new Function(fn) as TickerFunction

        /* If it's already a function, we'll just use that. */
        case "function":
          return fn
      }
    }

    /* Store new value, constructing a function from a string if necessary */
    this.callbacks[eventName] = createCallbackFunction(fn)

    /* Register new callback */
    const newCallback = this.callbacks[eventName]
    if (newCallback) {
      this.ticking = true

      /*
      We're using setTimeout as a stopgap measure here to accomodate for the fact
      that the three-game tag may not be available and upgraded at the time this
      property is set. We'll find a nicer solution for this eventually.
      */
      setTimeout(() => {
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
      static threeConstructor = constructor
    }
  }
}
