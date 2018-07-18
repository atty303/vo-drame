import { Premiere } from '../../shared'

const app = ($.global.app as App)

function nativeToLocal(project: Project): Premiere.Project {
  return {
    id: project.documentID,
    name: project.name,
    path: project.path
  }
}

export class ProjectService implements Premiere.ProjectApi {
  currentProject(): Promise<Premiere.Project> {
    return nativeToLocal(app.project)
  }

  importMedia(params: { id: Premiere.ProjectId, files: string[], targetBin?: any }): Promise<boolean> {
    return false
  }
}
