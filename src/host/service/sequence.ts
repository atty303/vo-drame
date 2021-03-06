import {Premiere} from '../../shared'
import * as util from './util'


function findTrackItemByName(track: Track, name: string) {
  return util.find(track.clips, (i: TrackItem) => i.name === name)
}

export class SequenceService implements Premiere.SequenceApi {
  expose(f: util.ExposeFn): void {
    f('syncClips', this.syncClips.bind(this))
  }

  syncClips(params: {id: Premiere.SequenceId, clips: Premiere.SyncingClip[]}): void {
    const s = util.find(app.project.sequences, (v: Sequence) => v.sequenceID === params.id) // TODO: multi project
    if (!s) return

    const audioTrack = s.audioTracks[0]
    if (!audioTrack) throw new Error(`Sequence ${params.id} hasn't audio tracks`)

    const videoTrack = s.videoTracks[0]
    if (!videoTrack) throw new Error(`Sequence ${params.id} hasn't video tracks`)

    const portraitTrack = s.videoTracks[1]
    if (!portraitTrack) throw new Error(`Sequence ${params.id} hasn't video tracks`)

    // remove all clips
    for (let i = audioTrack.clips.numItems - 1; i >= 0; i--) {
      const clip = audioTrack.clips[i]
      ;(clip as any).remove(false)
    }

    for (let i = videoTrack.clips.numItems - 1; i >= 0; i--) {
      const clip = videoTrack.clips[i]
      ;(clip as any).remove(false)
    }
    for (let i = portraitTrack.clips.numItems - 1; i >= 0; i--) {
      const clip = portraitTrack.clips[i]
      ;(clip as any).remove(false)
    }

    const bin = util.ensureAssetBin(app.project) // FIXME: multiple project

    params.clips.forEach((clip, i) => {
      const asset = util.findAssetFileByPath(bin, clip.path)
      if (asset) {
        audioTrack.overwriteClip(asset, clip.startAt)

        const placedClip = audioTrack.clips[i]
        const endTime = new Time()
        endTime.seconds =  placedClip.start.seconds + clip.duration
        ;(placedClip as any).end = endTime
      }
    })


    params.clips.forEach((clip, i) => {
      const subtitle = util.findProjectItemByPath(app.project, clip.subtitlePath) // FIXME: multiple project
      if (!subtitle) throw new Error(`Subtitle was not found: ${clip.subtitlePath}`)

      ;(subtitle as any).setOutPoint(0.1)

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

    params.clips.forEach((clip, i) => {
      //console.log('***', i, clip)
      const portrait = util.findProjectItemByPath(app.project, clip.portraitPath) // FIXME: multiple project
      if (!portrait) throw new Error(`Subtitle was not found: ${clip.portraitPath}`)

      ;(portrait as any).setOutPoint(0.1)

      clip.visemes.forEach((viseme) => {
        const at = clip.startAt + viseme.at
        portraitTrack.overwriteClip(portrait, at)
        const placedClip: any = portraitTrack.clips[portraitTrack.clips.numItems - 1]
        placedClip.name = clip.id
        const endTime = new Time()
        endTime.seconds =  placedClip.start.seconds + viseme.duration
        placedClip.end = endTime

        const props = placedClip.getMGTComponent().properties
        const sourceTextProp = props.getParamForDisplayName('Mouth')
        sourceTextProp.setValue(viseme.value)
      })

      if (i < params.clips.length - 1) {
        const next = params.clips[i + 1]
        portraitTrack.overwriteClip(portrait, clip.startAt + clip.duration)
        const placedClip: any = portraitTrack.clips[portraitTrack.clips.numItems - 1]
        placedClip.name = clip.id
        const endTime = new Time()
        endTime.seconds =  placedClip.start.seconds + (next.startAt - clip.startAt)
        placedClip.end = endTime

        const props = placedClip.getMGTComponent().properties
        const sourceTextProp = props.getParamForDisplayName('Mouth')
        sourceTextProp.setValue(0)
      }
    })
  }
}
