import {Premiere} from '../../shared'
import {find} from './util'
import {ExposeFn} from './type'

// FIXME: xmp.ts と重複している
declare class XMPMeta {
  constructor(serialized: string)
  dumpObject(): any
  getProperty(ns: string, field: string): any
  setProperty(ns: string, field: string, value: any): void
  doesPropertyExist(ns: string, field: string): boolean
  serialize(): string
}

const kPProPrivateProjectMetadataURI = 'http://ns.adobe.com/premierePrivateProjectMetaData/1.0/'
const scenePropertyName = 'VoDrameScene'

export class SequenceService implements Premiere.SequenceApi {
  expose(f: ExposeFn): void {
    f('setScene', this.setScene.bind(this))
    f('getScene', this.getScene.bind(this))
  }

  setScene(params: {id: Premiere.SequenceId, value: string}): void {
    const s = find(app.project.sequences, (v: Sequence) => v.sequenceID === params.id) // TODO: multi project
    if (s) {
      this.ensureSceneMetadata()
      const x = new XMPMeta(s.projectItem.getProjectMetadata())
      console.log(x.dumpObject())
      x.setProperty(kPProPrivateProjectMetadataURI, scenePropertyName, params.value)
      ;(s.projectItem as any).setProjectMetadata(x.serialize(), [scenePropertyName])
    }
  }

  getScene(params: {id: Premiere.SequenceId}): string | undefined {
    const s = find(app.project.sequences, (v: Sequence) => v.sequenceID === params.id) // TODO: multi project
    if (s) {
      return s.projectItem.getProjectMetadata()
      /*
      const x = new XMPMeta(s.projectItem.getProjectMetadata())
      const v =  x.getProperty(kPProPrivateProjectMetadataURI, scenePropertyName)
      return v
      */
    }
  }

  private ensureSceneMetadata(): void {
    const p = app.project // TODO: multiple project
    p.addPropertyToProjectMetadataSchema(scenePropertyName, 'vo:Drame Scene JSON', Premiere.MetadataType.String)
  }
}
