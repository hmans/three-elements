import * as THREE from "three"
import { ThreeGame } from "./elements/ThreeGame"
import { IConstructable, isDisposable, IStringIndexable } from "./types"
import { applyProps } from "./util/applyProps"
import { observeAttributeChange } from "./util/observeAttributeChange"
import { CallbackKind, TickerFunction } from "./util/Ticker"

const CALLBACKS: CallbackKind[] = ["onupdate", "onlateupdate", "onframe", "onrender"]

export class ThreeElement<T> extends HTMLElement {
  /** The THREE.* object managed by this element. */
  object?: T

  /** A reference to the game (with ticker, scene etc.) */
  game?: ThreeGame

  /** A dictionary of ticker callbacks (onupdate, etc.) */
  private callbacks = {} as Record<CallbackKind, TickerFunction | undefined>

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
  }

  connectedCallback() {
    this.debug("connectedCallback")

    /*
    If there are already tags in the DOM, newly created custom elements will connect in the order they
    are defined, which isn't always what we want (because a Material node that intends to attach itself to
    a Mesh might be defined before the element that represents that Mesh. Woops!)

    For this reason, we'll use a simple trick -- we will wait with the actual mounting until another tick
    has passed, by way of setTimeout.

    Yeah, I know. Crazy. But it solves the problem elegantly. Except that classes overloading
    connectedCallback() will need to remember doing this. For this reason, we're now offering slightly
    more convenient to use `mount` and `unmount` methods.
    */
    setTimeout(() => {
      /* Find and store reference to game */
      this.game = this.find((node) => node instanceof ThreeGame) as ThreeGame

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
      this.handleAttach()
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

      /* Add object to scene */
      this.addObjectToScene()

      /* Invoke mount method */
      this.mount()
    })
  }

  mount() {}

  disconnectedCallback() {
    /* Invoke unmount method */
    this.unmount()

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

  unmount() {}

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
    let node: HTMLElement | undefined = this

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
    if (this.object instanceof THREE.Object3D) {
      if (!this.game) {
        console.error(
          `Trying to insert a new Object3D into the scene, but no <three-game> tag was found! 😢  This may mean that we're failing to escape a custom element's shadow DOM. If you think this is a bug with three-elements, please open an issue! <https://github.com/hmans/three-elements/issues/new>`
        )
      } else {
        const parent = this.findElementWith(THREE.Object3D)

        if (parent) {
          this.debug("Parenting under:", parent)

          if (parent.object) {
            parent.object.add(this.object)
          } else {
            console.error(
              `Tried to parent my object under ${parent}, but it was not exposing a Three object itself! 😢`
            )
          }
        } else {
          this.debug("No parent found, parenting into scene!")
          this.game.scene.add(this.object)
        }
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
        console.error(`Tried to attach to the "${attach} property, but there was no parent! 😢`)
        return
      } else if (parent instanceof ThreeElement) {
        this.debug("Attaching to:", parent)
        parent.object[attach!] = this.object
      } else {
        console.error(
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
    // console.debug(`<${this.tagName.toLowerCase()}>`, ...output)
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
