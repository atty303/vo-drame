import {Premiere} from '../../shared'
import {find, findAssetFileByPath, ensureAssetBin} from './util'
import {ExposeFn} from './type'

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
const scenePropertyName = 'VoDrameScene'
const mogrtBinName = "mogrt"

function findMogrt(name: string): ProjectItem | undefined {
  // TODO: multi project
  const bin = find(app.project.rootItem.children, (i: ProjectItem) => i.name === mogrtBinName)
  if (bin) {
    return find(bin.children, (i: ProjectItem) => i.name === name)
  }
}

function findTrackItemByName(track: Track, name: string) {
  return find(track.clips, (i: TrackItem) => i.name === name)
}

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

    const videoTrack = s.videoTracks[0]
    if (!videoTrack) throw new Error(`Sequence ${params.id} hasn't video tracks`)

    // remove all clips
    for (let i = audioTrack.clips.numItems - 1; i >= 0; i--) {
      const clip = audioTrack.clips[i]
      ;(clip as any).remove(false)
    }

    for (let i = videoTrack.clips.numItems - 1; i >= 0; i--) {
      const clip = videoTrack.clips[i]
      ;(clip as any).remove(false)
    }

    const bin = ensureAssetBin(app.project) // FIXME: multiple project

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

    const subtitle = findMogrt('Subtitle') // FIXME: make configurable
    if (!subtitle) throw new Error('Subtitle was not found')

    ;(subtitle as any).setOutPoint(0.1)

    params.clips.forEach((clip, i) => {
      videoTrack.overwriteClip(subtitle, clip.startAt)
      const placedClip: any = videoTrack.clips[i]
      placedClip.name = clip.id
      const endTime = new Time()
      endTime.seconds =  placedClip.start.seconds + clip.duration
      placedClip.end = endTime

      const props = placedClip.getMGTComponent().properties
      const sourceTextProp = props.getParamForDisplayName('SourceText')
      sourceTextProp.setValue(clip.subtitle)
    })
  }

  private ensureSceneMetadata(): void {
    const p = app.project // TODO: multiple project
    p.addPropertyToProjectMetadataSchema(scenePropertyName, 'vo:Drame Scene JSON', MetadataType.String)
  }
}
