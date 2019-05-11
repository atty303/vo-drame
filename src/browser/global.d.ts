declare interface NodeModule {
  // https://parceljs.org/hmr.html
  hot: {
    dispose: (cb: () => void) => void
    accept: (cb: () => void) => void
  }
}

declare var cep: any

declare var cep_node: {
  Buffer: Buffer
  global: any
  process: any
  require: (path: string) => any
}
