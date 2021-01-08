import { applyProps } from "./util/applyProps"
import { observeAttributeChange } from "./util/observeAttributeChange"
import { ThreeGame } from "./elements/ThreeGame"
import { IConstructable } from "./types"
import * as THREE from "three"
import { CallbackKind, TickerFunction } from "./util/Ticker"

type EffectFunction = () => Function

export class ThreeElement<T> extends HTMLElement {
  /** Constructor of the THREE class we will be instancing. */
  klass?: IConstructable

  /** The THREE.* object managed by this element. */
  object: any //T

  /** A reference to the game (with ticker, scene etc.) */
  game?: ThreeGame

  /** Properties that will automatically be applied to the managed object. */
  props?: Record<string, any>

  /** Name of the parent's property that this object should attach to. */
  attach?: string

  private cleanupFns = new Array<Function>()

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
    this.props = remainingProps
    this.attach = attach

    /* Register callbacks */
    /* TODO: this should really happen in applyProps, so it remains reactive. */
    for (const kind of ["onupdate", "onlateupdate", "onrender"] as CallbackKind[]) {
      if (kind in remainingProps) {
        this.effect(() => {
          /* Extract callback handler from props */
          const value = remainingProps[kind]
          delete remainingProps[kind]

          /* Register callback function */
          const fn = new Function("delta = arguments[0]", `fun = ${value}`, "fun(delta)").bind(this)
          this.game!.ticker.addCallback(kind, fn as TickerFunction)

          /* register function for cleanup on unmount! */
          return () => {
            this.game!.ticker.removeCallback(kind, fn as TickerFunction)
          }
        })
      }
    }

    /* Create managed object */
    this.object = args ? new this.klass(...JSON.parse(args)) : new this.klass()

    /* Apply props */
    applyProps(this.object, this.props)

    /* When one of this element's attributes changes, apply it to the object. */
    observeAttributeChange(this, (prop, value) => {
      applyProps(this.object, { [prop]: value })
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

    /* Execute cleanup functions */
    for (const cleanupFn of this.cleanupFns) cleanupFn()
    this.cleanupFns = []

    /* If the wrapped object is parented, remove it from its parent */
    if (this.object.parent) {
      this.object.parent.remove(this.object)
    }
  }

  private effect(fn: EffectFunction) {
    const cleanupFn = fn()
    this.cleanupFns.push(cleanupFn)
  }
}
