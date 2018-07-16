export var shared = "TEST"

export * from './premiere'

// Bridge for host application context and browser context
export namespace Bridge {
  export const NamespaceInGlobal = '__io_github_atty303'

  export enum Functions {
    ComlinkOnMessage = "comlinkPostMessage"
  }

  export enum Events {
    ComlinkMessage = "io.github.atty303.Scenario.Core.Message"
  }
}
