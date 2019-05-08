import { Premiere } from "../../shared";

declare var Folder: {
  fs: string
}

export function find<T, U>(arrayLike: T, predicate: (v: U) => boolean): U | undefined {
  let count = 0
  if ((arrayLike as any).numItems > 0) count = (arrayLike as any).numItems
  if ((arrayLike as any).numSequences > 0) count = (arrayLike as any).numSequences
  if ((arrayLike as any).numProjects > 0) count = (arrayLike as any).numProjects

  for (let i = 0; i < count; ++i) {
    const value = (arrayLike as any)[i]
    if (predicate(value)) return value
  }
}

function extractFilename(path: string): string {
  const sep = (Folder.fs === 'Macintosh') ? '/' : '\\'
  return path.slice(path.lastIndexOf(sep) + 1)
}

export function findAssetFileByPath(bin: ProjectItem, path: string): ProjectItem | undefined {
  const filename = extractFilename(path)
  return find(bin.children, (i: ProjectItem) => {
    return extractFilename(i.getMediaPath()) === filename
  })
}

const assetBinName = 'vo:Drame Assets'

export function ensureAssetBin(project: Project): ProjectItem {
  let bin = find(project.rootItem.children, (item: ProjectItem) => item.name === assetBinName)
  if (!bin) {
    project.rootItem.createBin(assetBinName)
    bin = find(project.rootItem.children, (item: ProjectItem) => item.name === assetBinName)
    if (!bin) throw new Error(`Couldn't create bin: ${assetBinName}`)
  }
  return bin
}

export function findProjectItemByPath(project: Project, path: Premiere.MediaPath): ProjectItem | undefined {
  const run = (bin: ProjectItem, xs: string[]): ProjectItem | undefined => {
    let found: ProjectItem | undefined
    for (let i = 0; i < bin.children.numItems; ++i) {
      const item = bin.children[i]
      if (item.name === xs[0]) {
        found = item
        break
      }
    }
    if (found) {
      if (xs.length === 1) {
        return found
      } else {
        return run(found, xs.slice(1))
      }
    }
  }

  return run(project.rootItem, path.split('/'))
}
