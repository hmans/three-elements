import * as THREE from "three"
import { BaseElement } from "./BaseElement"
import { IConstructor, isDisposable } from "./types"
import { applyProp, applyPropWithDirective } from "./util/applyProps"
import { attributeValueToArray } from "./util/attributeValueToArray"

/**
 * The `ThreeElement` class extends `BaseElement` with some code that manages an instance
 * of a given Three.js class. It's the centerpiece of three-elements, with most elements
 * provided by the library derived from it.
 */
export class ThreeElement<T = any> extends BaseElement {
  static exposedProperties = BaseElement.exposedProperties

  /** Constructor that will instantiate our object. */
  static threeConstructor?: IConstructor

  /*** MANAGED THREE.JS OBJECT ***/

  /** The THREE.* object managed by this element. */
  get object() {
    if (!this._object) this._object = this.constructWrappedObject()
    return this._object
  }

  set object(v: T | undefined) {
    this._object = v
  }

  private _object?: T

  protected constructWrappedObject() {
    const constructor = (this.constructor as typeof ThreeElement).threeConstructor

    if (constructor) {
      this.debug("Creating wrapped object instance")
      let object: T

      /* Create managed object */
      const args = this.getAttribute("args")

      if (args) {
        object = new constructor(...attributeValueToArray(args))
      } else {
        object = new constructor()
      }

      /*
      Store a reference to this element in the wrapped object's userData -- we'll
      need it whenever we want to link a Three.js scene object back to the DOM element
      that owns it.
      */
      if (object instanceof THREE.Object3D) {
        object.userData.threeElement = this
      }

      return object
    }
  }

  /*** CALLBACKS ***/

  mountedCallback() {
    super.mountedCallback()

    /* Handle attach attribute */
    this.handleAttach()

    /* Add object to scene */
    this.addObjectToParent()

    /* Make sure a frame is queued */
    this.game.requestFrame()
  }

  removedCallback() {
    /* Queue a frame, because very likely something just changed in the scene :) */
    this.game.requestFrame()

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

    super.removedCallback()
  }

  attributeChangedCallback(key: string, oldValue: any, newValue: any) {
    if (super.attributeChangedCallback(key, oldValue, newValue)) return true

    /*
    Okay, at this point, we'll just assume that the property lives on the wrapped object.
    Good times! Let's assign it. If we have an object, that is.
    */
    return this.object ? applyPropWithDirective(this.object, key, newValue) : false
  }

  protected addObjectToParent() {
    /*
    If the wrapped object is an Object3D, add it to the scene. If we can find a parent somewhere in the
    tree above it, parent our object to that.
    */
    if (this.object instanceof THREE.Object3D && !(this.object instanceof THREE.Scene)) {
      const parent = this.findElementWithInstanceOf(THREE.Object3D) as ThreeElement<THREE.Object3D>

      if (parent) {
        this.debug("Parenting under:", parent)
        parent.object!.add(this.object)
      } else {
        throw `Found no suitable parent for ${this.htmlTagName}. Did you forget to add a <three-scene> tag? 😢`
      }
    }
  }

  protected handleAttach() {
    if (!this.object) return

    /* Use provided attach, or auto-set it based on the tag name. */
    let attach = this.getAttribute("attach")

    if (attach === null) {
      if ((this.object as any).isMaterial) {
        attach = "material"
      } else if ((this.object as any).isGeometry || (this.object as any).isBufferGeometry) {
        attach = "geometry"
      } else if ((this.object as any).isFog) {
        attach = "fog"
      } else if ((this.object as any).isColor) {
        attach = "color"
      }
    }

    /*
    If the wrapped object has an "attach" attribute, automatically assign it to the
    value of the same name in the parent object.
    */
    if (attach) {
      const parent = this.find((node) => node instanceof ThreeElement)

      if (!parent) {
        this.error(`Tried to attach to the "${attach} property, but there was no parent! 😢`)
      } else if (parent instanceof ThreeElement) {
        this.debug("Attaching to:", parent)
        parent.object[attach] = this.object
      } else {
        this.error(
          `Tried to attach to the "${attach} property of ${parent}, but it's not a ThreeElement! It's possible that the target element has not been upgraded to a ThreeElement yet. 😢`
        )
      }
    }
  }

  static for<T>(constructor: IConstructor<T>): IConstructor<ThreeElement<T>> {
    /*
    Create an anonymous class that inherits from our cool base class, but sets
    its own Three.js constructor property.
    */
    return class extends this<T> {
      static threeConstructor = constructor
    }
  }
}
