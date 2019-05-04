import {Premiere} from '../../shared'
import {ExposeFn} from './type'

export * from './project'
export * from './sequence'
export * from './helper'

function wrapExposeFn(prefix: string, f: ExposeFn): ExposeFn {
  return (name: string, handler: (params: any) => any) => {
    f(prefix + name, handler)
  }
}

export class PremiereService implements Premiere.Api {
  helper: Premiere.HelperApi
  project: Premiere.ProjectApi
  sequence: Premiere.SequenceApi

  constructor(helper: Premiere.HelperApi, project: Premiere.ProjectApi, sequence: Premiere.SequenceApi) {
    this.helper = helper
    this.project = project
    this.sequence = sequence
  }

  expose(f: ExposeFn): void {
    ;(this.project as any).expose(wrapExposeFn('project.', f))
    ;(this.sequence as any).expose(wrapExposeFn('sequence.', f))
  }
}
