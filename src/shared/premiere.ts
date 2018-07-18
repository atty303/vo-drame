export namespace Premiere {
  export interface Api {
    helper: HelperApi
    project: ProjectApi
  }

  export interface HelperApi {
    version(): Promise<string>
  }

  export type ProjectId = string

  export interface Project {
    id: ProjectId
    name: string
    path: string
  }

  export interface ProjectApi {
    currentProject(): Promise<Project>
    importMedia(params: { id: ProjectId, files: string[], targetBin?: any }): Promise<boolean>
  }
}
