import { applyProps } from "./util/applyProps"
import { observeAttributeChange } from "./util/observeAttributeChange"
import { ThreeGame } from "./elements/ThreeGame"
import { IConstructable, IStringIndexable } from "./types"
import * as THREE from "three"
import { CallbackKind, Ticker, TickerFunction } from "./util/Ticker"

type EffectFunction = () => Function

export class ThreeElement<T> extends HTMLElement {
  /** Constructor of the THREE class we will be instancing. */
  klass?: IConstructable

  /** The THREE.* object managed by this element. */
  object: any //T

  /** A reference to the game (with ticker, scene etc.) */
  game?: ThreeGame

  /** Name of the parent's property that this object should attach to. */
  attach?: string

  private callbacks = {} as Record<CallbackKind, TickerFunction>

  get onupdate() {
    return this.callbacks["onupdate"]
  }

  set onupdate(fn: TickerFunction | string) {
    this.setCallback("onupdate", fn)
  }

  get onlateupdate() {
    return this.callbacks["onlateupdate"]
  }

  set onlateupdate(fn: TickerFunction | string) {
    this.setCallback("onlateupdate", fn)
  }

  get onframe() {
    return this.callbacks["onframe"]
  }

  set onframe(fn: TickerFunction | string) {
    this.setCallback("onframe", fn)
  }

  get onrender() {
    return this.callbacks["onrender"]
  }

  set onrender(fn: TickerFunction | string) {
    this.setCallback("onrender", fn)
  }

  connectedCallback() {
    if (!this.klass) return

    /* Find and store reference to game */
    for (let node = this.parentElement; node; node = node.parentElement) {
      if (node instanceof ThreeGame) {
        this.game = <ThreeGame>node
        break
      }
    }

    /* Extract props from element attributes */
    const attributes = this.getAttributeNames().reduce((acc, name) => {
      acc[name] = this.getAttribute(name)
      return acc
    }, {} as Record<string, any>)

    const { attach, args, ...remainingProps } = attributes

    /* Use provided attach, or auto-set it based on the tag name. */
    if (attach) {
      this.attach = attach
    } else if (this.tagName.endsWith("-MATERIAL")) {
      this.attach = "material"
    } else if (this.tagName.endsWith("-GEOMETRY")) {
      this.attach = "geometry"
    }

    /* Create managed object */
    this.object = args ? new this.klass(...JSON.parse(args)) : new this.klass()

    /* Apply props */
    this.handleAttributes(remainingProps)

    /* When one of this element's attributes changes, apply it to the object. */
    observeAttributeChange(this, (prop, value) => {
      this.handleAttributes({ [prop]: value })
    })

    /* If the wrapped object has an "attach" attribute, automatically assign it to the
       value of the same name in the parent object. */
    if (this.attach) {
      const parent = this.parentElement

      if (parent instanceof ThreeElement) {
        parent.object[this.attach] = this.object
      }
    }

    /* If the wrapped object is an Object3D, add it to the scene */
    if (this.game && this.object instanceof THREE.Object3D) {
      this.game.scene.add(this.object)
    }
  }

  disconnectedCallback() {
    if (!this.object) return

    /* If the wrapped object is parented, remove it from its parent */
    if (this.object.parent) {
      this.object.parent.remove(this.object)
    }
  }

  private handleAttributes(attributes: IStringIndexable) {
    const { onupdate, onlateupdate, onrender, ...wrappedObjectAttributes } = attributes

    /* Assign some attributes to the element itself */
    applyProps(this, { onupdate, onlateupdate, onrender })

    /* Assign everything else to the wrapped Three.js object */
    applyProps(this.object, attributes)
  }

  private setCallback(kind: CallbackKind, fn: TickerFunction | string) {
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
}
