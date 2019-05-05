import {Premiere} from '../../shared'
import {ExposeFn} from './type'
import {find, findAssetFileByPath, ensureAssetBin} from './util'

function findProject(id: Premiere.ProjectId): Project {
  const p = find(app.projects, (i: Project) => i.documentID == id)
  if (p) {
    return p
  } else {
    throw new Error(`Project not found: ${id}`)
  }
}

export class ProjectService implements Premiere.ProjectApi {
  expose(f: ExposeFn): void {
    f('currentProjectId', this.currentProjectId.bind(this))
    f('getProjectById', this.getProjectById.bind(this))
    f('getSequences', this.getSequences.bind(this))
    f('getAssetFiles', this.getAssetFiles.bind(this))
    f('importAssetFiles', this.importAssetFiles.bind(this))
  }

  currentProjectId(): Premiere.ProjectId {
    return app.project.documentID
  }

  getProjectById(id: Premiere.ProjectId): Premiere.Project {
    const project = findProject(id)
    return {
      id: project.documentID,
      name: project.name,
      path: project.path
    }
  }

  getSequences(params: { id: Premiere.ProjectId }): Premiere.Sequence[] {
    const p = findProject(params.id)
    const sequences: Premiere.Sequence[] = []
    for (let i = 0; i < p.sequences.numSequences; ++i) {
      const s: Sequence = (p.sequences as any)[i]
      sequences.push({
        projectId: p.documentID,
        id: s.id,
        sequenceId: s.sequenceID as Premiere.SequenceId,
        name: s.name,
      })
    }
    return sequences
  }

  getAssetFiles(params: { id: Premiere.ProjectId }): Premiere.AssetFile[] {
    const p = findProject(params.id)
    let bin = ensureAssetBin(p)

    const assets: Premiere.AssetFile[] = []
    for (let i = 0; i < bin.children.numItems; ++i) {
      const item: ProjectItem = (bin.children as any)[i]
      console.log('###', item)
      if (item.type === 1) { // ProjectItemType.CLIP
        assets.push({
          path: item.getMediaPath(),
          name: item.name,
        })
      }
    }
    return assets
  }

  importAssetFiles(params: { id: Premiere.ProjectId, files: Premiere.ImportingAssetFile[] }): void {
    const p = findProject(params.id)
    let bin = ensureAssetBin(p)

    // import files
    const importingFiles = params.files.filter(f => f.action === Premiere.ImportAction.Import)
    if (importingFiles.length > 0) {
      const paths = importingFiles.map(f => f.path)
      p.importFiles(paths, true, bin as any, false)
    }

    // refresh files
    const refreshingFiles = params.files.filter(f => f.action === Premiere.ImportAction.Refresh)
    if (refreshingFiles.length > 0) {
      refreshingFiles.forEach(file => {
        const item = findAssetFileByPath(bin, file.path)
        if (item) {
          item.refreshMedia()
          ;(item as any).clearOutPoint()
        }
      })
    }

    // rename project items
    params.files.forEach(file => {
      const item = findAssetFileByPath(bin, file.path)
      if (item) {
        item.name = file.name
      }
    })
  }
}
