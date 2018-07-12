import * as csi from 'csinterface-ts'
import * as jsonRpc from 'noice-json-rpc'

import { Protocol } from '../../shared/Protocol'

class EvalSocketLike implements jsonRpc.LikeSocket {
    csInterface: csi.CSInterface
    messageCallback?: Function

    constructor(csiInterface: csi.CSInterface) {
        this.csInterface = csiInterface;
    }
    
    send(message: string): void {
        const expr = `_daihon_rpc_server(${JSON.stringify(message)})`
        this.csInterface.evalScript(expr, (result) => {
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
    api: Protocol.Api

    private csInterface = new csi.CSInterface()

    constructor() {
        const socketLike = new EvalSocketLike(this.csInterface)
        const client = new jsonRpc.Client(socketLike, { logEmit: true, logConsole: true})
        this.api = client.api()
    }

    onLoaded() {
        const extBundle = this.csInterface.getSystemPath(csi.SystemPath.EXTENSION) + '/host/dist/main.js'
        this.evalScript(`$.evalFile("${extBundle}")`)
    }

    onBeforeUnload() {
    }
    
    reload(): void {
        window.location.reload()
    }

    private async evalScript(body: string): Promise<any> {
        return new Promise((resolve) => {
            this.csInterface.evalScript(body, (res) => resolve(res))
        })
    }
}

export default new Extension()
