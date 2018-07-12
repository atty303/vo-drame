<template>
    <div>
        {{name}} !!!
        <button @click="reload">reload</button>
        <button @click="test1">test1</button>
        <button @click="test2">test2</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Extension from '../extension'
import * as s from '../speech'

export default Vue.extend({
    data: () => {
        return { name: "hello" }
    },
    methods: {
        reload() {
            Extension.reload()
        },

        async test1() {
            const p = await Extension.api.project.currentProject()
            console.log(p)

            Extension.api.project.importMedia({
                id: p.id,
                files: ["C:/Users/atty/Documents/Adobe/Premiere Pro/12.0/media/001.wav"]
            })
        },

        test2() {
            const kiritan = new s.VoiceroidExPlusKiritan()
            kiritan.play({ text: 'はろー' })
        }
    }
})
</script>
