import axios from 'axios'

import {fs, fs_promises, path} from '../util/node'
import {Scene} from '../domain'
import {Premiere} from '../../shared'
import {SpeechFileAdapter, SpeechFile} from './SpeechFile'

export * from './SpeechFile'

export interface ScenarioService {
  loadScene(sequenceId: Premiere.SequenceId): Promise<Scene | undefined>
  saveScene(sequenceId: Premiere.SequenceId, scene: Scene): Promise<void>
  syncScene(sequenceId: Premiere.SequenceId, scene: Scene): Promise<void>
  getSequences(): Promise<Premiere.Sequence[]>
}

export class ScenarioServiceImpl implements ScenarioService {
  constructor(api: Premiere.Api, speechFileAdapter: SpeechFileAdapter) {
    this.api = api
    this.speechFileAdapter = speechFileAdapter
  }

  async loadScene(sequenceId: Premiere.SequenceId): Promise<Scene | undefined> {
    let scene: Scene | undefined = undefined
    const xmlString = await this.api.sequence.getScene({id: sequenceId})
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
    await this.api.sequence.setScene({id: sequenceId, value: JSON.stringify(scene)})
  }

  async syncScene(sequenceId: Premiere.SequenceId, scene: Scene): Promise<void> {
    const projectId = await this.api.project.currentProjectId()
    const bundlePath = await this.ensureBundlePath()

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

      const r = {
        id: dialogue.id,
        path: speechFile.path,
        duration: speechFile.duration,
        startAt,
        subtitle: dialogue.text,
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
