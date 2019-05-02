import {fs, fs_promises, path} from '../util/node'
import {Scene} from '../domain'
import {Premiere} from '../../shared'



export interface ScenarioService {
  loadScene(): Promise<Scene | undefined>
  saveScene(scene: Scene): Promise<void>
  syncScene(scene: Scene): Promise<void>
}

export class ScenarioServiceImpl implements ScenarioService {
  constructor(api: Premiere.Api) {
    this.api = api
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

  private async ensureBundlePath(): Promise<string> {
    const p = await this.api.project.currentProject()
    const bundlePath = p.path.slice(0, p.path.lastIndexOf('.')) + '.drame'
    if (!(await fs_promises.exists(bundlePath))) {
      await fs_promises.mkdir(bundlePath)
    }
    return bundlePath
  }

  private api: Premiere.Api
}
