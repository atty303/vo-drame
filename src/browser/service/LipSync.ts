import {child_process} from '../util/node'

export interface LipSyncViseme {
  at: number
  value: number
  duration: number
}

export class LipSyncService {
  constructor(ovrLipSyncExecutable: string) {
    this.ovrLipSyncExecutable = ovrLipSyncExecutable
  }

  async process(wavPath: string): Promise<LipSyncViseme[]> {
    const [stdout, stderr] = await new Promise((resolv, reject) => {
      child_process.execFile(this.ovrLipSyncExecutable, [wavPath], (err, stdout: string, stderr: string) => {
        if (err) {
          reject(err)
        } else {
          resolv([stdout, stderr])
        }
      })
    })
    const visemes: number[] = stdout.split(/\n/).map((n: string) => parseInt(n))
    const mapped = visemes.map(v => this.simpleVisemeMap[v])

    const timeline: LipSyncViseme[] = []
    let startAt = 0
    let prevViseme = undefined
    for (let i = 0; i < mapped.length - 1; ++i) {
      if (mapped[i] !== prevViseme) {
        timeline.push({ at: startAt, value: mapped[i], duration: 0 })
        prevViseme = mapped[i]
      }
      timeline[timeline.length - 1].duration += 0.01
      startAt += 0.01
    }
    console.log(timeline)
    return timeline
  }

  private ovrLipSyncExecutable: string

  // https://developer.oculus.com/documentation/audiosdk/latest/concepts/audio-ovrlipsync-viseme-reference/
  private simpleVisemeMap: number[] = [
    0, // sil
    0, // PP
    1, // FF
    1, // TH
    2, // DD
    2, // kk
    2, // CH
    1, // SS
    2, // nn
    0, // RR
    2, // aa
    2, // E
    1, // I
    1, // O
    0, // U
  ]
}
