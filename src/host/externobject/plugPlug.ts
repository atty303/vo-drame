
declare class CSXSEvent {
  type?: string
  scope?: Scope
  appId?: string
  extensionId?: string
  data?: string
  dispatch: () => void
}

type Scope = "GLOBAL" | "APPLICATION"

export class PlugPlugExternalObject {
  pluginInstance: {
    terminate: () => void
    unload: () => void
  }

  constructor() {
    this.pluginInstance = new ExternalObject('lib:PlugPlugExternalObject')
  }

  static dispatchEvent(type: string, data: string): void {
    const event = new CSXSEvent()
    event.type = type
    event.data = data
    event.extensionId = "hogehoge"
    event.dispatch()
  }
}
