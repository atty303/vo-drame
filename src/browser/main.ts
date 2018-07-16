import Vue from 'vue'
import Vuetify from 'vuetify'

import AppComponent from './App.vue'
import { BrowserEndpoint, reloadHostScript } from './cse'
import { premiereApiClient } from './global'

// stylesheets
import 'vuetify/dist/vuetify.min.css'
import './stylus/main.styl'

// Reload host(Premiere) script bundle when browser content was hot reloaded
declare var module: any
if (module.hot) {
  module.hot.dispose(() => onUnload(true))
  module.hot.accept(() => onLoad(true))
}

function onLoad(isHotLoading: boolean) {
  if (isHotLoading) reloadHostScript()
  premiereApiClient.start()
}

function onUnload(isHotLoading: boolean) {
  premiereApiClient.close()
}

Vue.use(Vuetify, {})

const vm = new Vue({
    el: '#app',
    render: (h) => {
        return h('app-component');
    },
    components: {
        AppComponent
    }
})

onLoad(false)
