import { Premiere } from '../../shared'

export * from './helper'
export * from './project'

export class PremiereService implements Premiere.Api {
  helper: Premiere.HelperApi
  project: Premiere.ProjectApi

  constructor(helper: Premiere.HelperApi, project: Premiere.ProjectApi) {
    this.helper = helper
    this.project = project
  }
}
