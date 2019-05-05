import {Premiere} from '../../shared'
import {find, findAssetFileByPath, ensureAssetBin} from './util'
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

enum MetadataType {
  Integer = 0,
  Real = 1,
  String = 2,
  Boolean = 3,
}

const kPProPrivateProjectMetadataURI = 'http://ns.adobe.com/premierePrivateProjectMetaData/1.0/'
const scenePropertyName = 'VoDrameScene'

export class SequenceService implements Premiere.SequenceApi {
  expose(f: ExposeFn): void {
    f('setScene', this.setScene.bind(this))
    f('getScene', this.getScene.bind(this))
    f('syncClips', this.syncClips.bind(this))
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

  syncClips(params: {id: Premiere.SequenceId, clips: Premiere.SyncingClip[]}): void {
    const s = find(app.project.sequences, (v: Sequence) => v.sequenceID === params.id) // TODO: multi project
    if (!s) return

    const audioTrack = s.audioTracks[0]
    if (!audioTrack) throw new Error(`Sequence ${params.id} hasn't audio tracks`)

    // remove all clips
    for (let i = audioTrack.clips.numItems - 1; i >= 0; i--) {
      const clip = audioTrack.clips[i]
      ;(clip as any).remove(true)
    }

    const bin = ensureAssetBin(app.project) // FIXME: multiple project

    //var t = app.project.activeSequence.audioTracks[0]
    params.clips.forEach((clip, i) => {
      const asset = findAssetFileByPath(bin, clip.path)
      if (asset) {
        audioTrack.overwriteClip(asset, clip.startAt)
        const placedClip = audioTrack.clips[i]
        const endTime = new Time()
        endTime.seconds =  placedClip.start.seconds + clip.duration
        ;(placedClip as any).end = endTime
      }
    })

    // var b = app.project.rootItem.children[1].children[0]
    // a.insertClip(b, 1)
  }

  private ensureSceneMetadata(): void {
    const p = app.project // TODO: multiple project
    p.addPropertyToProjectMetadataSchema(scenePropertyName, 'vo:Drame Scene JSON', MetadataType.String)
  }
}
