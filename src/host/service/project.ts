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

function findProject(id: Premiere.ProjectId): Maybe<Project> {
  for (let i = 0; i < app.projects.numProjects; ++i) {
    const p: Project = (app.projects as any)[i]
    if (p.documentID === id) return Maybe.just(p);
  }
  return Maybe.nothing()
}

export class ProjectService implements Premiere.ProjectApi {
  currentProject(): Promise<Premiere.Project> {
    return nativeToLocal(app.project)
  }

  getProjectById(id: Premiere.ProjectId): Promise<Maybe<Premiere.Project>> {
    return findProject(id).map(_ => nativeToLocal(_))
  }

  importMedia(params: { id: Premiere.ProjectId, files: string[], targetBin?: any }): Promise<boolean> {
    return findProject(params.id).caseOf({
      just: p => (p as any).importFiles(params.files, true),
      nothing: () => false
    })
  }
}
