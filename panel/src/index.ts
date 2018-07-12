import * as Immutable from 'immutable';
import * as csi from 'csinterface-ts';

class Startup {
    public static main(): number {
        //console.log("hello2");
        //console.log(window.location.href);

        (window.document.querySelector("#reload") as any).addEventListener('click', function() {
            //console.log('reload2');
            //console.log("hoge");
            const c = new csi.CSInterface();
            const extBundlePath = c.getSystemPath(csi.SystemPath.EXTENSION) + '/host/dist/main.js';
            c.evalScript(`$.evalFile("${extBundlePath}");`, (e: any) => {
                console.log(e);
                c.evalScript("_daihon.showBuildName();", () => {});
            });
            //window.location.reload();
        });
        
        return 0;
    }
}

// 脚本
interface Scenario {
    // 登場人物
    allCharacters: Character[]
    
    // シーン
    allScenes: Scene[]

    //
    linkedProject: Project
}

interface Scene {
    dialogues: Dialogue[]
    linkedSequence?: Sequence
}

interface Character {
    id: number
    speechEngine: SpeechEngine
}

// 台詞
interface Dialogue {
    id: number
    character: Character
    
    subtitle: Subtitle
    spech: Speech
    
    preMargin: number
    postMargin: number
}

// 字幕
interface Subtitle {
    text: string
    linkedClip?: Clip
}

interface ISpeech {
    text: string
    duration: number
    linkedClip?: Clip
}

class Speech extends Immutable.Record({
    text: "",
    duration: 0,
    linkedClip: undefined
}) implements ISpeech {
    text!: string;
    duration!: number;
    linkedClip?: Clip

    constructor(props: ISpeech) {
        super(props);
    }
}


interface Project {
    sequences: Sequence[]
}

interface Sequence {
    id: string
}

interface Clip {
    nodeId: string // ProjectItem.nodeId
    track: number
}

import { SpeechEngine } from './speech';

class SceneDirector {
    lastScene?: Scene
     
    public update(newScene: Scene) {
        // diff(lastScene, newScene)
        // add/update speech
        // sync with premiere
        // - add new media
        // - refresh changed media
        // persist to metadata
    }
}

Startup.main();