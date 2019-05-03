import axios from 'axios'

import {fs, fs_promises, path} from '../util/node'
import {Scene} from '@/domain'
import {Premiere} from '../../shared'
import {SpeechFileAdapter, SpeechFile} from './SpeechFile'

export * from './SpeechFile'

export interface ScenarioService {
  loadScene(): Promise<Scene | undefined>
  saveScene(scene: Scene): Promise<void>
  syncScene(scene: Scene): Promise<void>
  getSequences(): Promise<Premiere.Sequence[]>
}

export class ScenarioServiceImpl implements ScenarioService {
  constructor(api: Premiere.Api, speechFileAdapter: SpeechFileAdapter) {
    this.api = api
    this.speechFileAdapter = speechFileAdapter
  }

  async loadScene(): Promise<Scene | undefined> {
    const bundlePath = await this.ensureBundlePath()
    try {
      const json = await fs_promises.readFile(path.join(bundlePath, 'scene.json'), 'utf-8')
      const scene = JSON.parse(json as string)
      return scene
    } catch (e) {
      console.error(`couldn't load scene`, e)
      return
    }

  }

  async saveScene(scene: Scene): Promise<void> {
    const bundlePath = await this.ensureBundlePath()
    const fd = await fs_promises.open(path.join(bundlePath, 'scene.json'), 'w')
    try {
      await fs_promises.write(fd, JSON.stringify(scene))
    } catch (e) {
      throw e
    } finally {
      await fs_promises.close(fd)
    }
  }

  async syncScene(scene: Scene): Promise<void> {
    const p = await this.api.project.currentProject()
    const bundlePath = await this.ensureBundlePath()

    // render speechs
    const ps = scene.dialogues.map(async (dialogue) => {
      const res = await axios.post('https://vom303.ap.ngrok.io', dialogue.text, {responseType: 'arraybuffer'})
      const filePath = path.join(bundlePath, dialogue.text + '.wav')
      return await this.speechFileAdapter.write(filePath, Buffer.from(res.data))
    })
    const speechFiles = await Promise.all(ps)
    console.log(speechFiles)

    this.api.project.importMedia({id: p.id, files: speechFiles.map(f => f.path)})

    let startAt = 0
    speechFiles.forEach((file) => {
      const r = {
        ...file,
        startAt: startAt
      }
      startAt += file.duration + 1
    })
  }

  async getSequences(): Promise<Premiere.Sequence[]> {
    const p = await this.api.project.currentProject()
    return this.api.project.getSequences({id: p.id})
  }

  private async ensureBundlePath(): Promise<string> {
    const p = await this.api.project.currentProject()
    const bundlePath = p.path.slice(0, p.path.lastIndexOf('.')) + '.drame'
    if (!(await fs_promises.exists(bundlePath))) {
      await fs_promises.mkdir(bundlePath)
    }
    return bundlePath
  }

  private api: Premiere.Api
  private speechFileAdapter: SpeechFileAdapter
}
