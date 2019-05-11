import {EventEmitter} from 'events'
import {CSInterface, SystemPath, CSEvent} from 'csinterface-ts'
import * as noice from 'noice-json-rpc'

import {Bridge} from '../shared'

export const csi = new CSInterface()


export class BrowserEndpoint extends EventEmitter implements noice.LikeSocket {
  constructor() {
    super()
  }

  start() {
    csi.addEventListener(Bridge.Events.RpcMessage, this.onMessage)
    this.emit('open')
  }
  close() {
    csi.removeEventListener(Bridge.Events.RpcMessage, this.onMessage)
  }

  send(message: string): void {
    const messageAsLiteral = JSON.stringify(message)
    evalScript(`${Bridge.NamespaceInGlobal}.${Bridge.Functions.SendRpcMessage}(${messageAsLiteral})`)
    console.debug('-->', message)
  }

  onMessage = (event: CSEvent): void => {
    console.debug('<-- ', event)
    let data = event.data as any
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }
    this.emit('message', data)
  }
}

class CSExtendScriptError extends Error {
  constructor(obj: any) {
    super(obj.message)
    //this.name = obj.name
    //(this as any).source = obj.source
    //number, fileName, line, source, start, end
  }
}

export function getExtensionPath(): string {
  return csi.getSystemPath(SystemPath.EXTENSION)
}

export async function evalScript(body: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const expr = `
      try {
        ${body}
      } catch (e) {
        'CSE:' + JSON.stringify(e)
      }
      `
    csi.evalScript(expr, res => {
      if (typeof res === 'string' && res.startsWith('CSE:')) {
        reject(new CSExtendScriptError(JSON.parse(res.slice(4))))
      } else {
        resolve(res)
      }
    })
  })
}

export async function reloadHostScript(): Promise<void> {
  const hostScriptFile = (csi.getSystemPath(SystemPath.EXTENSION) + '/dist/host.js')
  const expr = `$.evalFile("${hostScriptFile}") && undefined`
  try {
    await evalScript(expr)
    console.log(`Host script was reload: ${hostScriptFile}`)
  } catch (e) {
    console.error('reloadHostScript: failed:', e)
  }
}
