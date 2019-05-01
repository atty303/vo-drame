export * from './premiere'

// Bridge for host application context and browser context
export namespace Bridge {
  export const NamespaceInGlobal = '__io_github_atty303'

  export enum Functions {
    SendRpcMessage = "sendRpcMessage"
  }

  export enum Events {
    RpcMessage = "io.github.atty303.vo-drame.rpc.message"
  }
}
