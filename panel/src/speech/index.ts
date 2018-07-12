import { promisify } from 'util';
import { exec } from 'child_process';

export interface SpeechEngine {
    play(direction: Direction): Promise<void>
    writeToFile(direction: Direction, path: string): Promise<void>
}

interface Direction {
    readonly text: string

    speed?: number
    tone?: number
}

declare var cep: any

export class VoiceroidExPlusKiritan implements SpeechEngine {
    //command = "C:/Users/atty/Documents/Home/bin/kiritan.exe";
    command = "C:/Users/atty/Documents/Home/bin/kiritan.exe";

    // 再生完了を知るべきか?
    async play(direction: Direction): Promise<void> {
        const cmd = `${this.command} ${direction.text}`;
        new Promise((resolve, reject) => {
            var r = cep.process.createProcess(this.command, direction.text)
            if (r.data >= 0) {
                cep.process.onquit(r.data, () => resolve())
                //console.log(cep.process.waitfor(r.data))
            }
        }) 
    }
    
    async writeToFile(direction: Direction, path: string): Promise<void> {
        const cmd = `${this.command} -s -o "${path}" ${direction.text}`;
        await promisify(exec)(cmd);
    }
}