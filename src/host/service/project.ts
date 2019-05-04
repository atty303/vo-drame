import {Premiere} from '../../shared'
import {ExposeFn} from './type'
import {find} from './util'

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

const assetBinName = 'vo:Drame Assets'

function ensureAssetBin(project: Project): ProjectItem {
  let bin = find(project.rootItem.children, (item: ProjectItem) => item.name === assetBinName)
  if (!bin) {
    project.rootItem.createBin(assetBinName)
    bin = find(project.rootItem.children, (item: ProjectItem) => item.name === assetBinName)
    if (!bin) throw new Error(`Couldn't create bin: ${assetBinName}`)
  }
  return bin
}

export class ProjectService implements Premiere.ProjectApi {
  expose(f: ExposeFn): void {
    f('currentProject', this.currentProject)
    f('getSequences', this.getSequences)
    f('importMedia', this.importMedia)
    f('importSpeechFiles', this.importSpeechFiles)
  }

  currentProject(): Premiere.Project {
    return nativeToLocal(app.project)
  }

  getProjectById(id: Premiere.ProjectId): Premiere.Project | undefined {
    const p = findProject(id)
    if (p) return nativeToLocal(p)
  }

  getSequences(params: { id: Premiere.ProjectId }): Premiere.Sequence[] {
    const p = findProject(params.id)
    const sequences: Premiere.Sequence[] = []
    if (p) {
      for (let i = 0; i < p.sequences.numSequences; ++i) {
        const s: Sequence = (p.sequences as any)[i]
        sequences.push({
          projectId: p.documentID,
          id: s.id,
          sequenceId: s.sequenceID as Premiere.SequenceId,
          name: s.name,
        })
      }
    }
    return sequences
  }

  importSpeechFiles(params: { id: Premiere.ProjectId, files: string[] }): void {
    const p = findProject(params.id)
    if (!p) throw new Error(`Project not found: ${params.id}`)

    let bin = ensureAssetBin(p)
    p.importFiles(params.files, true, bin as any, false)
  }

  importMedia(params: { id: Premiere.ProjectId, files: string[], targetBin?: any }): boolean {
    const p = findProject(params.id)
    if (p) {
      return (p as any).importFiles(params.files, true)
    }
    return false
  }
}
