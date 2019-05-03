import {fs_promises} from '../util/node'
import * as wavfile from '../util/wavfile'

export interface SpeechFile {
  path: string
  duration: number
}

export interface SpeechFileAdapter {
  read(path: string): Promise<SpeechFile>
  write(path: string, data: Buffer): Promise<SpeechFile>
}

export class SpeechFileAdapterImpl implements SpeechFileAdapter {
  async read(path: string): Promise<SpeechFile> {
    const waveInfo = await wavfile.parseFile(path)
    return { path, duration: waveInfo.duration }
  }

  async write(path: string, data: Buffer): Promise<SpeechFile> {
    await fs_promises.writeFile(path, data)
    return await this.read(path)
  }
}
