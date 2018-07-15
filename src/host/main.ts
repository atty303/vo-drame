import 'extendscript-es5-shim-ts'
//import 'core-js/core/object'

// need polyfill
$.global.ArrayBuffer = function() {}
$.global.MessagePort = function() {}
$.global.Symbol = function(name?: string) { return name; }


declare var $: any

$.writeln("hoge1")

declare var ExternalObject: any

type Scope = "GLOBAL" | "APPLICATION"
declare class CSXSEvent {
  type?: string
  scope?: Scope
  appId?: string
  extensionId?: string
  data?: string
  dispath: () => void
}

const plugPlug = new ExternalObject('lib:PlugPlugExternalObject')


import * as Comlink from 'extendscript-comlinkjs'

class HostEndpoint implements Comlink.Endpoint {
  private listeners: { [type: string]: any[] } = {}

  constructor() {

  }

  addEventListener(type: string, listener: any, options?: {} | undefined): void {
    if (!this.listeners[type]) this.listeners[type] = []
    if (!(listener in this.listeners[type])) this.listeners[type].push(listener)
  }
  removeEventListener(type: string, listener: any, options?: {} | undefined): void {
    if (this.listeners[type]) {
      const i = this.listeners[type].indexOf(listener)
      if (i >= 0) this.listeners[type].splice(i, 1)
    }
  }
  postMessage(message: any, transfer?: any[]): void {
    $.writeln(message)

    const payload = {
      message
    }

    const event = new CSXSEvent()
    event.type = 'daihon'
    event.data = JSON.stringify(payload)
    event.dispath()
  }

  onmessage(message: string): void {
    $.writeln('onmessage')
    (this.listeners['message'] || []).forEach((cb: any) => cb(message))
  }
}

class Api {
  debug() {
    $.writeln('debug')
  }
}



const endpoint = new HostEndpoint()
$.global._endpoint = endpoint


$.global.daihon = {
  safeEvalFile: function (filename: string) {
    try {
      return $.evalFile(filename);
    } catch (e) {
      return e;
    }
  },
  start: function () {
    Comlink.expose(new Api(), endpoint)
  }
}

$.writeln("Loaded")
