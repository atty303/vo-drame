/// <reference types="types-for-adobe/Premiere/2018" />

import "extendscript-es5-shim-ts"

import RootController from './RootController'
import { JsonRpc2 } from '../../shared/jsonrpc/json-rpc2'
import { Protocol } from '../../shared/Protocol'



class RpcServer {
    private methodHandlers: { [key: string]: (params: any) => any } = {}
    
    message(payload: string): string {
        let request: JsonRpc2.Request

        try {
            request = JSON.parse(payload)
        } catch (e) {
            return this.error(JsonRpc2.ErrorCode.ParseError, undefined, e)
        }

        if (request && request.method && typeof request.method === 'string') {
            const handler = this.methodHandlers[request.method]
            if (handler) {
                const result = handler.call(null, request.params)
                const res = JSON.stringify({ id: request.id, result: result || {}})
                return res
            } else {
                return this.error(JsonRpc2.ErrorCode.MethodNotFound, request)
            }
        } else {
            return this.error(JsonRpc2.ErrorCode.InvalidRequest, request)
        }
    }

    expose(method: string, handler: (params: any) => any): void {
        this.methodHandlers[method] = handler
    }

    private error(errorCode: JsonRpc2.ErrorCode, request?: JsonRpc2.Request, error?: Error): string {
        const payload = {
            id: request && request.id || -1,
            error: this._errorFromCode(errorCode, error && error.message || error, request && request.method)
        }
        return JSON.stringify(payload)
    }

    private _errorFromCode(code: JsonRpc2.ErrorCode, data?: any, method?: string): JsonRpc2.Error {
        let message = ''

        switch (code) {
            case JsonRpc2.ErrorCode.InternalError:
                message =  `InternalError: Internal Error when calling '${method}'`
                break
            case JsonRpc2.ErrorCode.MethodNotFound:
                message =  `MethodNotFound: '${method}' wasn't found`
                break
            case JsonRpc2.ErrorCode.InvalidRequest:
                message =  'InvalidRequest: JSON sent is not a valid request object'
                break
            case JsonRpc2.ErrorCode.ParseError:
                message =  'ParseError: invalid JSON received'
                break
        }

        return {code, message, data}
    }
}

const a: Protocol.Api = {
    version: () => "hogehoge"
}

const server = new RpcServer()
server.expose('version', a.version)

$.global._daihon_rpc_server = function (payload: string) {
    return server.message.call(server, payload);
}
$.global._daihon = new RootController();
