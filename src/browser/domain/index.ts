import * as uuid from 'uuid'

export class Dialogue {
  static empty(): Dialogue {
    return new Dialogue()
  }

  constructor(p?: Dialogue) {
    if (p) {
      this.id = p.id
      this.text = p.text
    }
  }

  id: string = uuid.v4()
  text: string = ''
}

export class Scene {
  static empty(): Scene {
    return new Scene()
  }

  static newTemplate(): Scene {
    const dialogues: Dialogue[] = []
    for (let i = 0; i < 10; ++i) {
      dialogues.push(Dialogue.empty())
    }
    return new Scene({dialogues})
  }

  constructor(p?: { dialogues: Dialogue[] }) {
    if (p) {
      this.dialogues = p.dialogues.map(d => new Dialogue({ id: d.id, text: d.text }))
    }
  }

  dialogues: Dialogue[] = []

  get isEmpty(): boolean {
    return this.dialogues.length === 0
  }

  get nonEmpty(): boolean {
    return !this.isEmpty
  }
}
