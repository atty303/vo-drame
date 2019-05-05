import * as uuid from 'uuid'


export class Dialogue {
  id: string = uuid.v4()
  text: string = ''
}

export class Scene {
  dialogues: Dialogue[] = []
}
