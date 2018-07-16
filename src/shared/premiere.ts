export namespace Premiere {
  export interface Api {
      helper: HelperApi
      project: ProjectApi
  }

  export interface HelperApi {
      version(): string
  }

  type ProjectId = string

  interface Project {
      id: ProjectId
      name: string
      path: string
  }

  export interface ProjectApi {
      currentProject(): Project
      importMedia(params: { id: ProjectId, files: string[], targetBin?: any }): boolean
  }
}
