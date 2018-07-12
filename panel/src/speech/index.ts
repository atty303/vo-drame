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

class VoiceroidExPlusKiritan implements SpeechEngine {
    command = "C:/Users/atty/Documents/Home/bin/kiritan.exe";

    // 再生完了を知るべきか?
    async play(direction: Direction): Promise<void> {
        const cmd = `${this.command} ${direction.text}`;
        await promisify(exec)(cmd);
    }
    
    async writeToFile(direction: Direction, path: string): Promise<void> {
        const cmd = `${this.command} -s -o "${path}" ${direction.text}`;
        await promisify(exec)(cmd);
    }
}