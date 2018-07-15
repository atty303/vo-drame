import 'extendscript-es5-shim-ts'

declare var $: any

$.writeln("hoge2")

import { ns } from './namespace'
import * as plugPlug from './externobject/plugPlug'

if (!ns.plugPlugObject) {
  ns.plugPlugObject = new plugPlug.PlugPlugExternalObject()
}

import * as Comlink from './comlink'
import { Bridge } from '../shared'

class Api {
  debug() {
    $.writeln('debug')
    return "from host"
  }
}

import * as cc from './comlink/comlink'
const a = cc
/*
const endpoint = new Comlink.HostEndpoint(
  (data) => plugPlug.PlugPlugExternalObject.dispatchEvent(Bridge.Events.ComlinkMessage, data),
  (t) => $.writeln(t)
)
ns.endpoint = endpoint
ns[Bridge.Functions.ComlinkOnMessage] = (data: string) => endpoint.onMessage(data)

Comlink.expose(new Api(), endpoint)

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
*/
