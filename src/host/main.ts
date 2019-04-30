/// <reference types="types-for-adobe/Premiere/2018" />

// Start timer for load time measurement (read this variable to reset timer)
$.hiresTimer

$.writeln(`###< Begin loading at ${new Date()}`)

import 'extendscript-es5-shim-ts'
import { ns } from './namespace'
import * as plugPlug from './externobject/plugPlug'
import * as Comlink from './comlink'
import { Bridge } from '../shared'
import { Premiere } from '../shared'
import * as s from './service'

if (!ns.plugPlugObject) {
  ns.plugPlugObject = new plugPlug.PlugPlugExternalObject()
  $.writeln("PlugPlugExternalObject was loaded")
}

function resolve<T>(value: T): Promise<T> {
  return value as any as Promise<T>
}

//Promise.resolve = <T>(value: T) => value

ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
function xmpTest(projectItem: ProjectItem)
{
  const xmpBlob = projectItem.getXMPMetadata()
  $.writeln('meta:' + xmpBlob)
  const xmp = new XMPMeta(xmpBlob)
  xmp.setProperty(XMPConst.NS_DM, 'foobar', 'hogehoge')
  const xmpAsString = xmp.serialize()
  projectItem.setXMPMetadata(xmpAsString)
}




const service = new s.PremiereService(
  new s.Helper(),
  new s.ProjectService()
)

const endpoint = new Comlink.HostEndpoint(
  (data) => plugPlug.PlugPlugExternalObject.dispatchEvent(Bridge.Events.ComlinkMessage, data),
  (t) => $.writeln(t)
)
ns.endpoint = endpoint
ns[Bridge.Functions.ComlinkOnMessage] = (data: string) => endpoint.onMessage(data)

Comlink.expose(service, endpoint)

const LoadEndedAt = $.hiresTimer
$.writeln(`###> Loaded in ${LoadEndedAt} ms`)
