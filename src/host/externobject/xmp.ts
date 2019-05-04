export declare class XMPMeta {
  constructor(serialized: string)
  dumpObject(): any
  getProperty(ns: string, field: string): any
  setProperty(ns: string, field: string, value: any): void
  serialize(): string
}

export class AdobeXMPScript {
  constructor() {
    this.pluginInstance = new ExternalObject('lib:AdobeXMPScript')
  }



  private pluginInstance?: {
    terminate: () => void
    unload: () => void
  }
}
