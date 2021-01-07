import { applyProps } from "./util/applyProps"
import { observeAttributeChange } from "./util/observeAttributeChange"
import { ThreeGame } from "./elements/ThreeGame"
import { IConstructable } from "./types"
import * as THREE from "three"

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

  connectedCallback() {
    if (!this.klass) return

    /* Extract props from element attributes */
    const attributes = this.getAttributeNames().reduce((acc, name) => {
      acc[name] = this.getAttribute(name)
      return acc
    }, {} as Record<string, any>)

    const { attach, args, ...remainingProps } = attributes
    this.props = remainingProps
    this.attach = attach

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

    /* Find and store reference to game */
    for (let node = this.parentElement; node; node = node.parentElement) {
      if (node instanceof ThreeGame) {
        this.game = <ThreeGame>node
        break
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
}
