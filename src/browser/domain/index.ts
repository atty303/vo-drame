import * as uuid from 'uuid'


export class Dialogue {
  static empty(): Dialogue {
    return new Dialogue()
  }

  id: string = uuid.v4()
  text: string = ''

  constructor(p?: Dialogue) {
    if (p) {
      this.id = p.id
      this.text = p.text
    }
  }
}

export class Scene {
  constructor(p?: Scene) {
    if (p) {
      this.dialogues = p.dialogues.map(d => new Dialogue({ id: d.id, text: d.text }))
    }
  }

  dialogues: Dialogue[] = []

  get nonEmpty(): boolean {
    return this.dialogues.length > 0
  }

}
