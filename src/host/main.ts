/// <reference types="types-for-adobe/Premiere/2018" />

// Start timer for load time measurement (read this variable to reset timer)
$.hiresTimer

// console shims
import {console} from './console'
$.global.console = console

console.log(`###< Begin loading at ${new Date()}`)

import 'extendscript-es5-shim-ts'
import * as noice from 'noice-json-rpc-extendscript'

import {ns} from './namespace'
import {HostEndpoint} from './rpc/endpoint'
import * as plugPlug from './externobject/plugPlug'
import * as xmp from './externobject/xmp'
import {Bridge} from '../shared'

// Load the PlugPlug plugin for messaging
if (!ns.plugPlugObject) {
  ns.plugPlugObject = new plugPlug.PlugPlugExternalObject('io.github.atty303.vo-drame')
  console.log('PlugPlugExternalObject was loaded')
}

// Load the AdobeXMPScript plugin
if (!ns.xmpObject) {
  ns.xmpObject = new xmp.AdobeXMPScript()
  console.log('AdobeXMPScript was loaded')
}

// Create host-side endpoint of the rpc server
const endpoint = new HostEndpoint(
  (data) => ns.plugPlugObject.dispatchEvent(Bridge.Events.RpcMessage, data),
  (t) => console.log(t)
)
ns.endpoint = endpoint
ns[Bridge.Functions.SendRpcMessage] = (data: string) => endpoint.message(data)

// Create the rpc server
const server = new noice.Server(endpoint, {logConsole: true})

import * as service from './service'

const srv = new service.PremiereService(
  new service.HelperService(),
  new service.ProjectService(),
  new service.SequenceService()
)

srv.expose(server.expose.bind(server))


console.log(`###> Loaded in ${$.hiresTimer} ms`)
