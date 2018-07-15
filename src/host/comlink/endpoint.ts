import * as Comlink from './comlink'

type EventDispatcher = (data: string) => void
type Logger = (message: string) => void

export class HostEndpoint implements Comlink.Endpoint {
  private logger: Logger
  private eventDispatcher: EventDispatcher
  private listeners: { [type: string]: any[] } = {}

  constructor(eventDispatcher: EventDispatcher, logger?: Logger) {
    this.eventDispatcher = eventDispatcher
    this.logger = logger || (_ => undefined)
  }

  addEventListener(type: string, listener: any, options?: {} | undefined): void {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(listener)
  }
  removeEventListener(type: string, listener: any, options?: {} | undefined): void {
    if (this.listeners[type]) {
      const i = this.listeners[type].indexOf(listener)
      if (i >= 0) this.listeners[type].splice(i, 1)
    }
  }
  postMessage(message: any, transfer?: any[]): void {
    const payload = {
      message
    }
    this.eventDispatcher(JSON.stringify(payload))
    this.logger(`Endpoint.postMessage: ${message}`)
  }

  onMessage(message: string): void {
    this.logger(`Endpoint.onMessage: type:${typeof message} ${message}`)
    ;(this.listeners['message'] || []).forEach((cb: any) => cb({ data: JSON.parse(message) }))
  }
}
