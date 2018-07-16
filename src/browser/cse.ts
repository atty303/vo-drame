import { CSInterface, SystemPath, CSEvent } from 'csinterface-ts'
import * as Comlink from 'comlinkjs'

import { Bridge } from '../shared'

const csi = new CSInterface()

class CsiError extends Error {}

export class BrowserEndpoint implements Comlink.Endpoint {
  private listeners: { [type: string]: any[] } = {}

  constructor() {
    csi.addEventListener(Bridge.Events.ComlinkMessage, (event: CSEvent) => this.onmessage(event))
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
    const json = JSON.stringify(JSON.stringify(message))
    evalScript(`${Bridge.NamespaceInGlobal}.${Bridge.Functions.ComlinkOnMessage}(${json})`, 5000)
    console.log('postMessage', message)
  }

  onmessage(event: CSEvent): void {
    console.log("onmessage:", event)
    const data = (event.data) as any
    console.log(data)
    ;(this.listeners['message'] || []).forEach((cb: any) => cb({ data: data.message }))
  }

}

export async function evalScript(body: string, timeout: number): Promise<any> {
  return new Promise((resolve, reject) => {
    // 評価時に例外が発生すると callback が呼ばれず Promise が完了しない…
    const timer = setTimeout(() => reject(new CsiError(`evalScript timeout: ${body}`)), timeout)
    csi.evalScript(body, res => {
      clearTimeout(timer)
      resolve(res)
    })
  })
}


export async function reloadHostScript(): Promise<void> {
  const hostScriptFile = (csi.getSystemPath(SystemPath.EXTENSION) + '/dist/host.js')
  const r = await evalScript(`daihon.safeEvalFile("${hostScriptFile}")`, 1000)
  if ((r as string) === '<<SUCCESS>>') {
    console.log(`Host script was reload: ${hostScriptFile}`)
  } else {
    console.error(`Host script was reloaded: ${r}`)
  }
}
