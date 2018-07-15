
import * as s from '../shared/index'
import { BrowserEndpoint, reloadHostScript } from './cse'

// stylesheets
import './stylus/main.styl'
import 'vuetify/dist/vuetify.min.css'

// Reload host(Premiere) script bundle when browser content was hot reloaded
declare var module: any
if (module.hot) {
  module.hot.accept(() => reloadHostScript())
}

console.log(s.shared)
console.log("11")

class Api {
  debug() {
  }
}

import * as Comlink from 'comlinkjs'
const api: Api = Comlink.proxy(new BrowserEndpoint(), new Api) as any

api.debug()
