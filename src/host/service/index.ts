import {Premiere} from '../../shared'
import {ExposeFn} from './type'

export * from './project'
export * from './helper'

function wrapExposeFn(prefix: string, f: ExposeFn): ExposeFn {
  return (name: string, handler: (params: any) => any) => {
    f(prefix + name, handler)
  }
}

export class PremiereService implements Premiere.Api {
  helper: Premiere.HelperApi
  project: Premiere.ProjectApi

  constructor(helper: Premiere.HelperApi, project: Premiere.ProjectApi) {
    this.helper = helper
    this.project = project
  }

  expose(f: ExposeFn): void {
    (this.project as any).expose(wrapExposeFn('project.', f))
  }

}
