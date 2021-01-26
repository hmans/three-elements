type EventListener = Function
type EventMap = Record<string, EventListener[]>

export class EventEmitter {
  protected events: EventMap = {}

  on(event: string, listener: EventListener) {
    this.events[event] ||= []
    this.events[event].push(listener)
  }

  off(event: string, listener: EventListener) {
    const listeners = this.events[event]

    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  emit<T = any>(event: string, data: T) {
    const listeners = this.events[event]

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](data)
      }
    }
  }
}
