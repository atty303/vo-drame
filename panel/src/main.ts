import Vue from 'vue'

import AppComponent from '/components/App.vue'


const vm = new Vue({
    el: '#app',
    render: (h) => {
        return h('app-component');
    },
    components: {
        AppComponent
    }
})
