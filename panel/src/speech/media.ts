import { fs_promise, path } from '../node'
import * as waveFile from '../wavfile'

/**
 * スピーチの指導
 *
 * エンジン固有のパラメータ
 */
export interface Direction {
    text: string
    digest: Digest
}

export type Digest = string

export interface Media {
    digest: Digest
    path: string
    duration: number
}

export class MediaRepository {
    directory: string

    constructor(p: { directory: string }) {
        this.directory = p.directory
    }

    async resolve(digest: Digest): Promise<Media> {
        const waveInfo = await waveFile.parseFile(this.mediaPath(digest))
        return { digest, path: this.mediaPath(digest), duration: waveInfo.duration }
    }

    async put(digest: Digest, source: string): Promise<Media> {
        const waveInfo = await waveFile.parseFile(source)
        if (!waveInfo.duration) {
            return Promise.reject("")
        }

        await fs_promise.rename(source, this.mediaPath(digest))
        return { digest, path: this.mediaPath(digest), duration: waveInfo.duration }
    }

    private mediaPath(digest: Digest): string {
        return path.join(this.directory, `${digest}.wav`)
    }
}
