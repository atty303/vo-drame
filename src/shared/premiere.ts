export namespace Premiere {
  export interface Api {
    helper: HelperApi
    project: ProjectApi
    sequence: SequenceApi
    metadata: MetadataApi
  }

  export interface HelperApi {
    version(): string
  }

  export type ProjectId = string

  export interface Project {
    id: ProjectId
    name: string
    path: string
  }

  export enum ImportAction {
    Ignore,
    Import,
    Refresh,
  }

  export interface AssetFile {
    path: string
    name: string
  }

  export interface ImportingAssetFile extends AssetFile {
    action: ImportAction
  }

  export interface ProjectApi {
    currentProjectId(): ProjectId
    getProjectById(id: Premiere.ProjectId): Premiere.Project
    getSequences(params: { id: Premiere.ProjectId }): Premiere.Sequence[]
    getAssetFiles(params: { id: Premiere.ProjectId }): Premiere.AssetFile[]
    importAssetFiles(params: { id: Premiere.ProjectId, files: ImportingAssetFile[] }): void
  }

  export type SequenceId = string

  export interface Sequence {
    projectId: ProjectId
    id: number
    sequenceId: SequenceId
    name: string
  }

  export type MediaPath = string

  export interface SyncingClip {
    id: string
    path: string
    duration: number
    startAt: number
    subtitle: string
    subtitlePath: MediaPath
    portraitPath: MediaPath
    visemes: Array<{
      at: number
      value: number
      duration: number
    }>
  }

  export interface SequenceApi {
    syncClips(params: {id: Premiere.SequenceId, clips: SyncingClip[]}): void
  }

  export interface MetadataApi {
    setProjectMetadata(params: {id: Premiere.ProjectId, value: string, presetPath: string}): void
    getProjectMetadata(params: {id: Premiere.ProjectId, presetPath: string}): string | undefined
    setSceneMetadata(params: {id: Premiere.SequenceId, value: string}): void
    getSceneMetadata(params: {id: Premiere.SequenceId}): string | undefined
  }
}
