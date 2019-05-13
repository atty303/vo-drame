import axios from 'axios'

import {fs, fs_promises, path} from '../util/node'
import {Scene, Actor} from '../domain'
import {Premiere} from '../../shared'
import {SpeechFileAdapter, SpeechFile} from './SpeechFile'
import * as cse from '../cse'

export * from './SpeechFile'

export interface ScenarioService {
  loadActorMetadata(): Promise<Actor[]>
  saveActorMetadata(actors: Actor[]): Promise<void>
  loadScene(sequenceId: Premiere.SequenceId): Promise<Scene | undefined>
  saveScene(sequenceId: Premiere.SequenceId, scene: Scene): Promise<void>
  syncScene(sequenceId: Premiere.SequenceId, scene: Scene, actors: Actor[]): Promise<void>
  getSequences(): Promise<Premiere.Sequence[]>
}

export class ScenarioServiceImpl implements ScenarioService {
  constructor(api: Premiere.Api, speechFileAdapter: SpeechFileAdapter) {
    this.api = api
    this.speechFileAdapter = speechFileAdapter
  }

  async loadActorMetadata(): Promise<Actor[]> {
    const projectId = await this.api.project.currentProjectId()
    const xmlString = await this.api.metadata.getProjectMetadata({
      id: projectId,
      presetPath: `${cse.getExtensionPath()}/res/placeholder.sqpreset`,
    })
    let actors: Actor[] = []
    if (xmlString) {
      const parser = new DOMParser()
      const xml = parser.parseFromString(xmlString as any, 'text/xml')
      const node = xml.querySelector('VoDrame')
      if (node) {
        const a = node.textContent
        if (a) {
          actors = JSON.parse(a).actors || []
        }
      }
    }
    return actors
  }

  async saveActorMetadata(actors: Actor[]): Promise<void> {
    const projectId = await this.api.project.currentProjectId() // FIXME: multi project
    this.api.metadata.setProjectMetadata({
      id: projectId,
      value: JSON.stringify({
        actors
      }),
      presetPath: `${cse.getExtensionPath()}/res/placeholder.sqpreset`,
    })
  }

  async loadScene(sequenceId: Premiere.SequenceId): Promise<Scene | undefined> {
    let scene: Scene | undefined = undefined
    const xmlString = await this.api.metadata.getSceneMetadata({id: sequenceId})
    if (xmlString) {
      const parser = new DOMParser()
      const xml = parser.parseFromString(xmlString as any, 'text/xml')
      const node = xml.querySelector('VoDrameScene')
      if (node) {
        const a = node.textContent
        if (a) {
          scene = new Scene(JSON.parse(a))
        }
      }
    }
    return scene
  }

  async saveScene(sequenceId: Premiere.SequenceId,  scene: Scene): Promise<void> {
    await this.api.metadata.setSceneMetadata({id: sequenceId, value: JSON.stringify(scene)})
  }

  async syncScene(sequenceId: Premiere.SequenceId, scene: Scene, actors: Actor[]): Promise<void> {
    const projectId = await this.api.project.currentProjectId()
    const bundlePath = await this.ensureBundlePath()

    const actorDict: {[name: string]: Actor} = {}
    actors.forEach(a => actorDict[a.name] = a)

    const assets = await this.api.project.getAssetFiles({id: projectId})

    // map import actions
    const actions = scene.dialogues.map(dialogue => {
      if (dialogue.text.length === 0) return { action: Premiere.ImportAction.Ignore, ...dialogue }
      const asset = assets.find(a => a.path.indexOf(dialogue.id) >= 0)
      if (asset) {
        const action = (asset.name !== dialogue.text) ? Premiere.ImportAction.Refresh : Premiere.ImportAction.Ignore
        return { action, ...dialogue }
      }
      return { action: Premiere.ImportAction.Import, ...dialogue }
    })

    const updatedAssets = actions.filter(s => s.action !== Premiere.ImportAction.Ignore)

    // render speechs
    const ps = updatedAssets.map(async (dialogue) => {
      const res = await axios.post('http://localhost:8080', dialogue.text, {responseType: 'arraybuffer'})
      const filePath = path.join(bundlePath, dialogue.id + '.wav')
      return {
        ...await this.speechFileAdapter.write(filePath, Buffer.from(res.data)),
        name: dialogue.text,
        action: dialogue.action,
       }
    })
    const speechFiles = await Promise.all(ps)

    // import assets
    if (speechFiles.length > 0) {
      this.api.project.importAssetFiles({id: projectId, files: speechFiles})
    }

    // read all speech durations
    const syncingAssets = scene.dialogues.filter(d => d.text.length > 0)
    let startAt = 0
    const clips: Premiere.SyncingClip[] = []
    for (let i = 0; i < syncingAssets.length; ++i) {
      const dialogue = syncingAssets[i]
      const filePath = path.join(bundlePath, dialogue.id + '.wav')
      const speechFile = await this.speechFileAdapter.read(filePath)
      const actor = actorDict[dialogue.actorName]

      const r = {
        id: dialogue.id,
        path: speechFile.path,
        duration: speechFile.duration,
        startAt,
        subtitle: dialogue.text,
        subtitlePath: actor.subtitle.mediaPath,
      }
      startAt += speechFile.duration
      startAt += (dialogue.margin !== undefined) ? dialogue.margin : 1
      clips.push(r)
    }
    //console.log(clips)

    this.api.sequence.syncClips({id: sequenceId, clips})
  }

  async getSequences(): Promise<Premiere.Sequence[]> {
    const id = await this.api.project.currentProjectId()
    return this.api.project.getSequences({id})
  }

  private async ensureBundlePath(): Promise<string> {
    const projectId = await this.api.project.currentProjectId()
    const p = await this.api.project.getProjectById(projectId)
    const bundlePath = p.path.slice(0, p.path.lastIndexOf('.')) + '.drame'
    if (!(await fs_promises.exists(bundlePath))) {
      await fs_promises.mkdir(bundlePath)
    }
    return bundlePath
  }

  private api: Premiere.Api
  private speechFileAdapter: SpeechFileAdapter
}
