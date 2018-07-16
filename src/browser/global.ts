import * as Comlink from 'comlinkjs'

import { BrowserEndpoint } from './cse'
import { Premiere } from '../shared'

class PremiereApiClient {
  apiProxy: Premiere.Api
  private endpoint: BrowserEndpoint

  constructor(endpoint: BrowserEndpoint) {
    this.endpoint = endpoint
    this.apiProxy = Comlink.proxy(endpoint, {}) as any
  }

  start() {
    this.endpoint.start()
  }
  close() {
    this.endpoint.close()
  }
}

export const premiereApiClient: PremiereApiClient = new PremiereApiClient(new BrowserEndpoint())
export const premiereApi: Premiere.Api = premiereApiClient.apiProxy
