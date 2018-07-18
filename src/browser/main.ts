import Vue from 'vue'
import Vuetify from 'vuetify'

import AppComponent from './App.vue'
import { BrowserEndpoint, reloadHostScript } from './cse'
import { premiereApiClient } from './global'



// stylesheets
import 'vuetify/dist/vuetify.min.css'
import './stylus/main.styl'

if (module.hot) {
  module.hot.accept(() => onLoad(true))
  module.hot.dispose(() => onUnload(true))
}

function onLoad(isHotLoading: boolean) {
  if (!isHotLoading) premiereApiClient.start()
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
