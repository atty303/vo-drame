
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
  constructor(extensionId: string) {
    this.extensionId = extensionId
    this.pluginInstance = new ExternalObject('lib:PlugPlugExternalObject')
  }

  dispatchEvent(type: string, data: string): void {
    const event = new CSXSEvent()
    event.type = type
    event.data = data
    event.extensionId = this.extensionId
    event.dispatch()
  }

  terminate(): void {
    if (this.pluginInstance) {
      this.pluginInstance.terminate()
    }
  }

  unload(): void {
    if (this.pluginInstance) {
      this.pluginInstance.unload()
      this.pluginInstance = undefined
    }
  }

  private extensionId: string
  private pluginInstance?: {
    terminate: () => void
    unload: () => void
  }
}
