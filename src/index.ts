import { dasherize, underscore } from "inflected"
import * as THREE from "three"
import { applyProps } from "./applyProps"
import { observeAttributeChange } from "./observeAttributeChange"
import "./ThreeBox"
import "./ThreeGame"
import { ThreeGame } from "./ThreeGame"

interface IConstructable<T = any> {
  new (...args: any): T
}

class ThreeElement<T> extends HTMLElement {
  /** The THREE.* object managed by this element. */
  object: any //T
}

const makeClass = <T>(klass: IConstructable<T>) => {
  return class extends ThreeElement<T> {
    /** A reference to the game (with ticker, scene etc.) */
    game?: ThreeGame

    /** Properties that will automatically be applied to the managed object. */
    props?: Record<string, any>

    /** Name of the parent's property that this object should attach to. */
    attach?: string

    connectedCallback() {
      /* Extract props from element attributes */
      const attributes = this.getAttributeNames().reduce((acc, name) => {
        acc[name] = this.getAttribute(name)
        return acc
      }, {} as Record<string, any>)

      const { attach, args, ...remainingProps } = attributes
      this.props = remainingProps
      this.attach = attach

      /* Create managed object */
      this.object = args ? new klass(...JSON.parse(args)) : new klass()

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
      /* If the wrapped object is parented, remove it from its parent */
      if (this.object.parent) {
        this.object.parent.remove(this.object)
      }
    }
  }
}

const defineThreeElements = () => {
  /* Custom elements we want to set up manually in order to get the naming right */
  customElements.define("three-object3d", makeClass(THREE.Object3D))

  for (const thing of Object.getOwnPropertyNames(THREE)) {
    const klass = THREE[thing as keyof typeof THREE]
    const name = `three-${dasherize(underscore(thing))}`

    if (klass instanceof Function && !customElements.get(name)) {
      customElements.define(name, makeClass(klass as IConstructable))
    }
  }
}

defineThreeElements()
