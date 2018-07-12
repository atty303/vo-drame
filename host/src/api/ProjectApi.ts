/// <reference types="types-for-adobe/Premiere/2018" />

import { Maybe } from 'tsmonad'
import { Protocol } from '../../../shared/Protocol'

const app = ($.global.app as App)

function findProjectByDocumentId(id: Protocol.ProjectId): Maybe<Project> {
    for (var i = 0; i < app.projects.numProjects; ++i) {
        const p: Project = (app.projects as any)[i]
        if (p.documentID === id) {
            return Maybe.just(p);
        }
    }
    return Maybe.nothing();
}

const api: Protocol.ProjectApi = {
    currentProject() {
        return {
            id: app.project.documentID,
            name: app.project.name,
            path: app.project.path
        }
    },

    importMedia(params: { id: Protocol.ProjectId, files: string[], targetBin?: any }): boolean {
        const p: any = findProjectByDocumentId(params.id).valueOrThrow(new Error(`Project ${params.id} not found`))
        $.writeln(`FOO: id: ${params.id} files:${params.files}`)
        return p.importFiles(params.files, true)
    }
}

export default api