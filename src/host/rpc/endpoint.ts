import * as noice from 'noice-json-rpc-extendscript'
import {EventEmitter} from 'eventemitter3'

type EventDispatcher = (data: string) => void
type Logger = (message: string) => void

class ClientSocket implements noice.LikeSocket {
  private ee = new EventEmitter()
  private eventDispatcher: EventDispatcher

  constructor(eventDispatcher: EventDispatcher) {
    this.eventDispatcher = eventDispatcher
  }

  emit(event: string, message: any): boolean {
    return this.ee.emit(event, message)
  }

  on(event: string, cb: Function): any {
    this.ee.on(event, cb as any)
  }

  removeListener(event: string, cb: Function): any {
    this.ee.removeListener(event, cb as any)
  }

  send(message: string): void {
    this.eventDispatcher(message)
  }
}

export class HostEndpoint extends EventEmitter implements noice.LikeSocketServer {
  private eventDispatcher: EventDispatcher
  private logger: Logger

  constructor(eventDispatcher: EventDispatcher, logger?: Logger) {
    super()
    this.eventDispatcher = eventDispatcher
    this.logger = logger || (_ => undefined)
  }

  message(message: any) {
    this.logger(`Endpoint.onMessage: type:${typeof message} ${message}`)
    const socket = new ClientSocket(this.eventDispatcher)
    this.emit('connection', socket)
    socket.emit('message', message)
  }
}
