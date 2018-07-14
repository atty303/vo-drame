import { path } from './node'
import * as s from './speech/engine'

import * as speech from './speech'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

import BaseX from 'base-x'

const b58 = BaseX(BASE58)

function randomString(): string {
    const b = new Buffer(8)
    b.writeDoubleLE(Math.random(), 0)
    return b58.encode(b)
}

export async function debug1() {
    const kiritan = new s.VoiceroidExPlusKiritan()
    //kiritan.play({ text: 'はろー' })

    const mediaDir = "C:\\Users\\atty\\Documents\\Adobe\\Premiere Pro\\12.0\\media"
    const repo = new speech.MediaRepository({ directory: mediaDir })

    const tmp = path.join(repo.directory, `${randomString()}.wav`)
    await kiritan.writeToFile({ text: 'こんにちは' }, tmp)
    repo.put("hoge", tmp)
}