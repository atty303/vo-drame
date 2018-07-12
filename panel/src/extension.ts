import * as csi from 'csinterface-ts'
import * as rpc from 'noice-json-rpc'

import { Protocol } from '../../shared/Protocol'

class EvalSocketLike implements rpc.LikeSocket {
    csiInterface: csi.CSInterface
    messageCallback?: Function

    constructor(csiInterface: csi.CSInterface) {
        this.csiInterface = csiInterface;
    }
    
    send(message: string): void {
        const expr = `_daihon_rpc_server(${JSON.stringify(message)})`
        this.csiInterface.evalScript(expr, (result) => {
            console.log(result)
            if (this.messageCallback) this.messageCallback.call(null, result)
        })
    }
    on(event: string, cb: Function) {
        switch (event) {
        case 'open':
            cb()
            break
        case 'message':
            this.messageCallback = cb
            break
        }
    }
    removeListener(event: string, cb: Function) {
        throw new Error("Method not implemented.");
    }


}

class Extension {
    private c = new csi.CSInterface()
    private bridgeObjectName = '_daihon'
    api: Protocol.Api

    constructor() {
        const socketLike = new EvalSocketLike(this.c)
        const a = new rpc.Client(socketLike, { logEmit: true, logConsole: true})
        this.api = a.api('')
    }
    
    async reload(): Promise<void> {
        const extBundle = this.c.getSystemPath(csi.SystemPath.EXTENSION) + '/host/dist/main.js'
        await this.evalScript(`$.evalFile("${extBundle}")`)
        window.location.reload()
    }

    getAllSequences(): Promise<any> {
        return this.callBridge("getSequences()")
    }

    private async evalScript(body: string): Promise<any> {
        return new Promise((resolve) => {
            this.c.evalScript(body, (res) => resolve(res))
        })
    }

    private async callBridge(body: string): Promise<any> {
        return this.evalScript(`${this.bridgeObjectName}.${body}`)
    }
}

export default new Extension()
