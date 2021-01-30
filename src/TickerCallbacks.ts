import { BaseElement } from "./BaseElement"
import { TickerFunction } from "./elements/three-game"

export class TickerCallbacks {
  /** A dictionary of ticker callbacks (ontick, etc.) */
  protected callbacks = {} as Record<string, TickerFunction | undefined>

  /** The element we're attached to. */
  element: BaseElement

  constructor(element: BaseElement) {
    this.element = element
  }

  get(name: string) {
    return this.callbacks[name]
  }

  /**
   * Configures one of the available ticker callbacks.
   *
   * @param name Name of the callback property (eg. `ontick`)
   * @param fn Callback function or string
   */
  set(name: string, fn?: TickerFunction | string) {
    /* Unregister previous callback */
    const previousCallback = this.callbacks[name]
    if (previousCallback) {
      this.element.game.emitter.off(name, previousCallback)
    }

    const createCallbackFunction = (fn?: TickerFunction | string) => {
      switch (typeof fn) {
        /* If the value is a string, we'll create a function from it. Magic! */
        case "string":
          return new Function(fn).bind(this.element) as TickerFunction

        /* If it's already a function, we'll just use that. */
        case "function":
          return (dt: number) => fn(dt, this.element)
      }
    }

    /* Store new value, constructing a function from a string if necessary */
    this.callbacks[name] = createCallbackFunction(fn)

    /* Register new callback */
    const newCallback = this.callbacks[name]
    if (newCallback) {
      /*
      We're using queueMicrotask here because at the point when a ticker event
      property is assigned, it's possible that the elements required to make this
      work are not done initializing yet.
      */
      queueMicrotask(() => {
        this.element.game.emitter.on(name, newCallback)
      })
    }
  }
}
