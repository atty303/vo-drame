import Vue from 'vue'
import Vuetify from 'vuetify'

import AppComponent from './App.vue'
import ext from './extension'
//import './main.styl'

ext.onLoaded()

declare var module: any
if (module.hot) {
  module.hot.accept(() => ext.reloadHostScript())
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
