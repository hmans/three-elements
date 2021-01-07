type TickerFunction = (dt: number) => any

export class Ticker {
  private alive = false

  start(tickFn: TickerFunction) {
    let lastNow = performance.now()

    const tick = () => {
      /* Figure out deltatime */
      const now = performance.now()
      const dt = (now - lastNow) / 1000
      lastNow = now

      /* Render scene */
      tickFn(dt)

      /* Loop as long as this ticker is active */
      if (this.alive) requestAnimationFrame(tick)
    }

    this.alive = true
    tick()
  }

  stop() {
    this.alive = false
  }
}
