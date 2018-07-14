import { Either } from 'tsmonad'
import { fs_promise } from './node'

export interface WaveFileInfo {
    duration: number
}

const headerStruct: [string, string, number][] = [
    ['riff_head', 'string', 4],
    ['chunk_size','uinteger', 4],
    ['wave_identifier', 'string', 4],
    ['fmt_identifier', 'string', 4],
    ['subchunk_size', 'integer', 4],
    ['audio_format', 'integer', 2],
    ['num_channels', 'integer', 2],
    ['sample_rate', 'uinteger', 4],
    ['byte_rate', 'integer', 4],
    ['block_align', 'integer', 2],
    ['bits_per_sample', 'integer', 2],
    ['data_identifier', 'string', 4],
]

function parseHeader(buf: Buffer): any {
    if (buf.length < 40) {
        return null
    }

    const header: any = {}
    let i = 0;
    headerStruct.forEach(([name, typ, size]) => {
        let value: any;
        switch (typ) {
        case 'string':
            value = buf.toString('ascii', i, i + size)
            break
        case 'integer':
            if (size === 2) {
                value = buf.readUInt16LE(i)
            } else if (size == 4) {
                value = buf.readInt32LE(i)
            }
            break
        case 'uinteger':
            value = buf.readUInt32LE(i)
        }
        i += size
        header[name] = value
    })
    return header
}

const knownFormats = [
    1, // Wav
    65534, // Extensible PCM
    2, // Wav
    22127, // Vorbis ??
    3, // Wav
]

type ParseError = { error: string }

function _parse(header: any): Either<ParseError, WaveFileInfo> {
    if (header.riff_head !== 'RIFF') return Either.left({ error: 'Expected "RIFF" string at 0' })
    if (header.wave_identifier !== 'WAVE') return Either.left({ error: 'Expected "WAVE" string at 4' })
    if (header.fmt_identifier !== 'fmt ') return Either.left({ error: 'Expected "fmt " string at 8' })
    if (knownFormats.indexOf(header.audio_format) < 0) return Either.left({ error: `Unknown format: ${header.audio_format}` })

    const bytesPerSecond = header.sample_rate * header.num_channels * (header.bits_per_sample / 8)
    const duration = header.chunk_size / bytesPerSecond
    return Either.right({
        duration
    })
}

export const parseFile = async (file: string): Promise<WaveFileInfo> => {
    const fd = await fs_promise.open(file, 'r')
    const buffer = new Buffer(40)
    await fs_promise.read(fd, buffer, 0, 40, 0)
    return new Promise<WaveFileInfo>((resolve, reject) =>
        _parse(parseHeader(buffer)).caseOf({
            left: (error) => reject(error),
            right: (info) => resolve(info)
        })
    )
}