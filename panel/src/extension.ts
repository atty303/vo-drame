import * as csi from 'csinterface-ts'

class Extension {
    private c = new csi.CSInterface()

    reload(): void {
        const extBundle = this.c.getSystemPath(csi.SystemPath.EXTENSION) + '/host/dist/main.js'
        this.c.evalScript(`$.evalFile("${extBundle}");`, (res) => {
            window.location.reload()
        })
    }
}

export default new Extension()
