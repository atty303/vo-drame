import {Premiere} from '../../shared'
import * as util from './util'

export * from './helper'
export * from './project'
export * from './sequence'
export * from './metadata'

function wrapExposeFn(prefix: string, f: util.ExposeFn): util.ExposeFn {
  return (name: string, handler: (params: any) => any) => {
    f(prefix + name, handler)
  }
}

export class PremiereService implements Premiere.Api {
  helper: Premiere.HelperApi
  project: Premiere.ProjectApi
  sequence: Premiere.SequenceApi
  metadata: Premiere.MetadataApi

  constructor(
    helper: Premiere.HelperApi,
    project: Premiere.ProjectApi,
    sequence: Premiere.SequenceApi,
    metadata: Premiere.MetadataApi) {
    this.helper = helper
    this.project = project
    this.sequence = sequence
    this.metadata = metadata
  }

  expose(f: util.ExposeFn): void {
    ;(this.project as any).expose(wrapExposeFn('project.', f))
    ;(this.sequence as any).expose(wrapExposeFn('sequence.', f))
    ;(this.metadata as any).expose(wrapExposeFn('metadata.', f))
  }
}
