import * as csi from 'csinterface-ts'

class Extension {
    private c = new csi.CSInterface()
    private bridgeObjectName = '_daihon'
    
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
