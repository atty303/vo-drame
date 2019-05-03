export namespace Premiere {
  export interface Api {
    helper: HelperApi
    project: ProjectApi
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

  export interface ProjectApi {
    currentProject(): Project
    getProjectById(id: Premiere.ProjectId): Premiere.Project | undefined
    getSequences(params: { id: Premiere.ProjectId }): Premiere.Sequence[]
    importMedia(params: { id: ProjectId, files: string[], targetBin?: any }): boolean
  }

  export type SequenceId = string

  export interface Sequence {
    id: number
    sequenceId: SequenceId
    name: string
  }
}
