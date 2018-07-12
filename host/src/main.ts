/// <reference types="types-for-adobe/Premiere/2018" />


import "extendscript-es5-shim-ts"

import { RpcServer } from "./RpcServer";
import api from './api'
import { Protocol } from '../../shared/Protocol'

const server = new RpcServer()
server.bind(api)

$.global._daihon_rpc_server = function (payload: string) {
    return server.message.call(server, payload);
}
