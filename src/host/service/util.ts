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
