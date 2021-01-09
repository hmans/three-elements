import * as THREE from "three"
import { ThreeGame } from "./elements/ThreeGame"
import { IConstructable, isDisposable, IStringIndexable } from "./types"
import { applyProps } from "./util/applyProps"
import { observeAttributeChange } from "./util/observeAttributeChange"
import { CallbackKind, TickerFunction } from "./util/Ticker"

export class ThreeElement<T> extends HTMLElement {
  /** Constructor of the THREE class we will be instancing. */
  protected static threeConstructor: IConstructable

  /** The THREE.* object managed by this element. */
  object: T

  /** A reference to the game (with ticker, scene etc.) */
  game?: ThreeGame

  /** A dictionary of ticker callbacks (onupdate, etc.) */
  private callbacks = {} as Record<CallbackKind, TickerFunction>

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

  constructor() {
    super()

    this.debug("constructor", this.getAllAttributes())

    /* Create managed object */
    const args = this.getAttribute("args")
    const constructor = (this.constructor as typeof ThreeElement).threeConstructor
    this.object = args ? new constructor(...JSON.parse(args)) : new constructor()
  }

  connectedCallback() {
    this.debug("connectedCallback")

    /* Find and store reference to game */
    this.game = this.find((node) => node instanceof ThreeGame) as ThreeGame

    this.handleAttach()

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
    If the wrapped object is an Object3D, add it to the scene. If we can find a parent somewhere in the
    tree above it, parent our object to that.
    */
    if (this.object instanceof THREE.Object3D) {
      if (!this.game) {
        console.error(
          `Trying to insert a new Object3D into the scene, but no <three-game> tag was found! 😢  This may mean that we're failing to escape a custom element's shadow DOM. If you think this is a bug with three-elements, please open an issue! <https://github.com/hmans/three-elements/issues/new>`
        )
      } else {
        const parent = this.findElement(THREE.Object3D)

        if (parent) {
          this.debug("Parenting under:", parent)
          parent.object.add(this.object)
        } else {
          this.debug("No parent found, parenting into scene!")
          this.game.scene.add(this.object)
        }
      }
    }
  }

  disconnectedCallback() {
    /* Unregister event handlers */
    for (const kind in ["onupdate", "onlateupdate", "onframe", "onrender"]) {
      this[kind as CallbackKind] = undefined
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
    let node: HTMLElement | undefined = this

    do {
      node = node.parentElement || (node.getRootNode() as any).host

      if (node && fn(node)) {
        return node
      }
    } while (node)
  }

  findElement<T>(klass: IConstructable<T>): ThreeElement<T> | undefined {
    return this.find((node) => node instanceof ThreeElement && node.object instanceof klass) as
      | ThreeElement<T>
      | undefined
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
      this.debug("Attaching to:", parent)

      if (parent instanceof ThreeElement) {
        parent.object[attach] = this.object
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
    applyProps(this.object!, wrappedObjectAttributes)
  }

  private setCallback(kind: CallbackKind, fn?: TickerFunction | string) {
    /* Unregister previous callback */
    if (this.callbacks[kind]) {
      this.game!.ticker.removeCallback(kind, this.callbacks[kind])
    }

    /* Store new value, constructing a function from a string if necessary */
    this.callbacks[kind] =
      typeof fn === "string"
        ? new Function("delta = arguments[0]", `fun = ${fn}`, "fun(delta)").bind(this)
        : fn

    /* Register new callback */
    if (this.callbacks[kind]) {
      this.game!.ticker.addCallback(kind, this.callbacks[kind])
    }
  }

  private debug(...output: any) {
    console.debug(`<${this.tagName.toLowerCase()}>`, ...output)
  }
}
