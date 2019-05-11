import {Premiere} from '../../shared'
import * as util from './util'

// FIXME: duplicate with xmp.ts
declare class XMPMeta {
  constructor(serialized: string)
  dumpObject(): any
  getProperty(ns: string, field: string): any
  setProperty(ns: string, field: string, value: any): void
  doesPropertyExist(ns: string, field: string): boolean
  serialize(): string
}

enum MetadataType {
  Integer = 0,
  Real = 1,
  String = 2,
  Boolean = 3,
}

const kPProPrivateProjectMetadataURI = 'http://ns.adobe.com/premierePrivateProjectMetaData/1.0/'
const projectPropertyName = 'VoDrame'
const scenePropertyName = 'VoDrameScene'

function ensureProjectMetadata(): void {
  const p = app.project // TODO: multiple project
  p.addPropertyToProjectMetadataSchema(projectPropertyName, 'vo:Drame Project JSON', MetadataType.String)
  p.addPropertyToProjectMetadataSchema(scenePropertyName, 'vo:Drame Scene JSON', MetadataType.String)
}

export class MetadataService implements Premiere.MetadataApi {
  expose(f: util.ExposeFn): void {
    f('setProjectMetadata', this.setProjectMetadata.bind(this))
    f('getProjectMetadata', this.getProjectMetadata.bind(this))
    f('setSceneMetadata', this.setSceneMetadata.bind(this))
    f('getSceneMetadata', this.getSceneMetadata.bind(this))
  }

  setProjectMetadata(params: {id: Premiere.ProjectId, value: string, presetPath: string}): void {
    const p = util.find(app.projects, (v: Project) => v.documentID === params.id)
    if (p) {
      const s = util.ensurePlaceholderSequence(p, params.presetPath)
      ensureProjectMetadata()
      const x = new XMPMeta(s.getProjectMetadata())
      x.setProperty(kPProPrivateProjectMetadataURI, projectPropertyName, params.value)
      ;(s as any).setProjectMetadata(x.serialize(), [projectPropertyName])
    }
  }

  getProjectMetadata(params: {id: Premiere.ProjectId, presetPath: string}): string | undefined {
    const p = util.find(app.projects, (v: Project) => v.documentID === params.id)
    if (p) {
      const s = util.ensurePlaceholderSequence(p, params.presetPath)
      return s.getProjectMetadata()
    }
  }

  setSceneMetadata(params: {id: Premiere.SequenceId, value: string}): void {
    const s = util.find(app.project.sequences, (v: Sequence) => v.sequenceID === params.id) // TODO: multi project
    if (s) {
      ensureProjectMetadata()
      const x = new XMPMeta(s.projectItem.getProjectMetadata())
      x.setProperty(kPProPrivateProjectMetadataURI, scenePropertyName, params.value)
      ;(s.projectItem as any).setProjectMetadata(x.serialize(), [scenePropertyName])
    }
  }

  getSceneMetadata(params: {id: Premiere.SequenceId}): string | undefined {
    const s = util.find(app.project.sequences, (v: Sequence) => v.sequenceID === params.id) // TODO: multi project
    if (s) {
      return s.projectItem.getProjectMetadata()
      /*
      const x = new XMPMeta(s.projectItem.getProjectMetadata())
      const v =  x.getProperty(kPProPrivateProjectMetadataURI, scenePropertyName)
      return v
      */
    }
  }

}
