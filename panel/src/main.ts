import Vue from 'vue'

import AppComponent from '/components/App.vue'
import ext from './extension'

ext.onLoaded()
//document.body.onbeforeunload

const vm = new Vue({
    el: '#app',
    render: (h) => {
        return h('app-component');
    },
    components: {
        AppComponent
    }
})
