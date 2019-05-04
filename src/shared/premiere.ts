export namespace Premiere {
  export interface Api {
    helper: HelperApi
    project: ProjectApi
    sequence: SequenceApi
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

  export enum MetadataType {
    Integer = 0,
    Real = 1,
    String = 2,
    Boolean = 3,
  }

  export interface ProjectApi {
    currentProject(): Project
    getProjectById(id: Premiere.ProjectId): Premiere.Project | undefined
    getSequences(params: { id: Premiere.ProjectId }): Premiere.Sequence[]
    importMedia(params: { id: ProjectId, files: string[], targetBin?: any }): boolean
    importSpeechFiles(params: { id: Premiere.ProjectId, files: string[] }): void
  }

  export type SequenceId = string

  export interface Sequence {
    projectId: ProjectId
    id: number
    sequenceId: SequenceId
    name: string
  }

  export interface SequenceApi {
    setScene(params: {id: Premiere.SequenceId, value: string}): void
    getScene(params: {id: Premiere.SequenceId}): string | undefined
  }
}
