export type TickerFunction = (dt: number) => any
export type CallbackKind = "onupdate" | "onlateupdate" | "onframe" | "onrender"

export class Ticker {
  private alive = false

  private callbacks = {} as Record<CallbackKind, Array<TickerFunction>>

  addCallback(kind: CallbackKind, fn: TickerFunction) {
    if (!this.callbacks[kind]) this.callbacks[kind] = []
    this.callbacks[kind].push(fn)
  }

  removeCallback(kind: CallbackKind, fn: TickerFunction) {
    this.callbacks[kind] = this.callbacks[kind].filter((f) => f !== fn)
  }

  private executeCallbacks(kind: CallbackKind, dt: number) {
    if (!this.callbacks[kind]) return

    for (const fn of this.callbacks[kind]) {
      fn(dt)
    }
  }

  start() {
    let lastNow = performance.now()

    const tick = () => {
      /* Figure out deltatime */
      const now = performance.now()
      const dt = (now - lastNow) / 1000
      lastNow = now

      /* Execute callbacks */
      this.executeCallbacks("onupdate", dt)
      this.executeCallbacks("onlateupdate", dt)
      this.executeCallbacks("onrender", dt)

      /* Loop as long as this ticker is active */
      if (this.alive) requestAnimationFrame(tick)
    }

    this.alive = true
    requestAnimationFrame(tick)
  }

  stop() {
    this.alive = false
  }
}
