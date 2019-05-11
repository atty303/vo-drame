import Vue from 'vue'
import * as noice from 'noice-json-rpc'

import App from './App.vue'
import * as cse from './cse'
import {Bridge, Premiere} from '../shared'
import * as service from './service'

// stylesheets
import './styles/main.styl'
import '../../node_modules/handsontable/dist/handsontable.full.css'

import './quasar-imports'

Vue.config.productionTip = false

if (module.hot) {
  module.hot.accept(() => onLoad(true))
  module.hot.dispose(() => onUnload(true))
}

const endpoint = new cse.BrowserEndpoint()
const client = new noice.Client(endpoint, {logConsole: false})
const api: Premiere.Api = client.api()

async function onLoad(isHotLoading: boolean) {
  if (!isHotLoading) endpoint.start()
}

function onUnload(isHotLoading: boolean) {
  endpoint.close()
}

onLoad(false)

const scenarioService = new service.ScenarioServiceImpl(
  api,
  new service.SpeechFileAdapterImpl())

new Vue({
  render: (h) => h(App),
  provide: {
    api,
    scenarioService,
  }
}).$mount('#app')

