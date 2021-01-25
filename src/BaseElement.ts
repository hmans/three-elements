import { observeAttributeChange } from "./util/observeAttributeChange"

export class BaseElement extends HTMLElement {
  /** Has the element been fully initialized? */
  isReady = false

  /** This element's MutationObserver. */
  private _observer?: MutationObserver

  /**
   * This callback is invoked when the element is deemed properly initialized. Most
   * importantly, this happens in a microtask that is very likely executed after all
   * the other elements in the document have finished running their connectedCallbacks.
   */
  readyCallback() {}

  /**
   * While disconnectedCallback is invoked whenever the element is removed from the DOM
   * _or_ just moved to a new parent, removedCallback will only be invoked when the
   * element is actually being removed from the DOM entirely.
   */
  removedCallback() {}

  connectedCallback() {
    this.debug("connectedCallback")

    /* Apply props */
    const attributes = this.getAllAttributes()
    for (const key in attributes) {
      this.attributeChangedCallback(key, "", attributes[key])
    }

    /*
    When one of this element's attributes changes, apply it to the object. Custom Elements have a built-in
    mechanism for this (attributeChangedCallback and observedAttributes, but unfortunately we can't use it,
    since we don't know the set of attributes the wrapped Three.js classes expose beforehand. So instead
    we're hacking our way around it using a mutation observer. Fun times!)
    */
    this._observer ||= observeAttributeChange(this, (prop, value) => {
      this.attributeChangedCallback(prop, (this as any)[prop], value)
    })

    /* Emit connected event */
    this.dispatchEvent(new CustomEvent("connected", { bubbles: true, cancelable: false }))

    /*
    Some stuff relies on all custom elements being fully defined and connected. However:

    If there are already tags in the DOM, newly created custom elements will connect in the order they
    are defined, which isn't always what we want (because a Material node that intends to attach itself to
    a Mesh might be defined before the element that represents that Mesh. Woops!)

    For this reason, we'll run some extra initialization inside a microtask:
    https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
    */
    queueMicrotask(() => {
      /* Invoke mount method */
      this.readyCallback()

      /* Emit ready event */
      this.dispatchEvent(new CustomEvent("ready", { bubbles: true, cancelable: false }))

      this.isReady = true
    })
  }

  disconnectedCallback() {
    this.debug("disconnectedCallback")

    /* Emit disconnected event */
    this.dispatchEvent(new CustomEvent("disconnected", { bubbles: true, cancelable: false }))

    /*
    If isConnected is false, this element is being removed entirely. In this case,
    we'll do some extra cleanup.
    */
    if (!this.isConnected) {
      queueMicrotask(() => {
        /* Emit disconnected event */
        this.dispatchEvent(new CustomEvent("removed", { bubbles: true, cancelable: false }))

        /* Invoke removedCallback */
        this.removedCallback()

        /* Disconnect observer */
        this._observer?.disconnect()
        this._observer = undefined
      })
    }
  }

  attributeChangedCallback(key: string, oldValue: string, newValue: string) {}

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
  find<T extends HTMLElement>(fn: (node: HTMLElement) => any): T | undefined {
    /* TODO: We might be able to replace this entire function with something like this.closest(). */

    /* Start here */
    let node: HTMLElement | undefined
    node = this

    do {
      /* Get the immediate parent, or, if we're inside a shaodow DOM, the host element */
      node = node.parentElement || (node.getRootNode() as any).host

      /* Check against the supplied function */
      if (node && fn(node)) {
        return node as T
      }
    } while (node)
  }

  /**
   * Returns this element's tag name, formatted as an actual HTML tag (eg. "<three-mesh>").
   */
  get htmlTagName() {
    return `<${this.tagName.toLowerCase()}>`
  }

  protected debug(...output: any) {
    // console.debug(`${this.htmlTagName}`, ...output)
  }

  protected error(...output: any) {
    console.error(`${this.htmlTagName}>`, ...output)
  }
}
