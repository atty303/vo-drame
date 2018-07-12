/// <reference types="types-for-adobe/Premiere/2018" />

export default class RootController {
    getSequences(): any {
        const r = []
        const project = (app as App).project
        for (var i = 0; i < project.sequences.numSequences; ++i) {
            const seq: Sequence = (project.sequences as any)[i]
            r.push({ seq, name: seq.name })
        
        }
        return JSON.stringify(r)
    }

    createBin(name: string) {
        const project = (app as App).project
        project.rootItem.createBin(name)
    }
}

