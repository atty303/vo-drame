import { CSInterface, SystemPath, CSEvent } from 'csinterface-ts'
import * as Comlink from 'comlinkjs'

import { Bridge } from '../shared'

const csi = new CSInterface()

class CsiError extends Error {}

export class BrowserEndpoint implements Comlink.Endpoint {
  private listeners: { [type: string]: any[] } = {}

  constructor() {
  }

  start() {
    csi.addEventListener(Bridge.Events.ComlinkMessage, this.onmessage)
  }
  close() {
    csi.removeEventListener(Bridge.Events.ComlinkMessage, this.onmessage)
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

  postMessage(message: any, transfer?: any[] | undefined): void {
    // const event = new CSEvent(Bridge.MessageEventName, "APPLICATION", "PPRO", csi.getExtensionID())
    // csi.dispatchEvent(event)
    const json = JSON.stringify(message)
    const jsonAsLiteral = JSON.stringify(json)
    evalScript(`${Bridge.NamespaceInGlobal}.${Bridge.Functions.ComlinkOnMessage}(${jsonAsLiteral})`)
    console.debug('-->', message)
  }

  onmessage = (event: CSEvent): void => {
    console.debug('<-- ', event)
    const data = (event.data) as any
    ;(this.listeners['message'] || []).forEach((cb: any) => cb({ data: data.message }))
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
