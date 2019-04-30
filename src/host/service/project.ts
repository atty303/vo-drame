import { Maybe } from 'tsmonad'
import { Premiere } from '../../shared'

const app = ($.global.app as App)

function nativeToLocal(project: Project): Premiere.Project {
  return {
    id: project.documentID,
    name: project.name,
    path: project.path
  }
}

function findProject(id: Premiere.ProjectId): Project | undefined {
  for (let i = 0; i < app.projects.numProjects; ++i) {
    const p: Project = (app.projects as any)[i]
    if (p.documentID === id) return p
  }
}

export class ProjectService implements Premiere.ProjectApi {
  currentProject(): Premiere.Project {
    return nativeToLocal(app.project)
  }

  getProjectById(id: Premiere.ProjectId): Premiere.Project | undefined {
    const p = findProject(id)
    if (p) return nativeToLocal(p)
  }

  importMedia(params: { id: Premiere.ProjectId, files: string[], targetBin?: any }): boolean {
    const p = findProject(params.id)
    if (p) {
      return (p as any).importFiles(params.files, true)
    }
    return false
  }

  getProjectMetadata(id: Premiere.ProjectId): string | undefined {
    return 'foo'
    const p = findProject(id)
    if (p) {
      return "hoge"
    }
    return "fuga"

}
