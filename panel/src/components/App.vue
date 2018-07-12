<template>
    <div>
        {{name}} !!!
        <button @click="reload">reload</button>
        <button @click="test1">test1</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Extension from '../extension'

export default Vue.extend({
    data: () => {
        return { name: "hello" }
    },
    methods: {
        reload() {
            Extension.reload()
        },

        async test1() {
            const r = await Extension.getAllSequences()
            console.log(r)
            console.log(JSON.parse(r))
        }
    }
})
</script>
