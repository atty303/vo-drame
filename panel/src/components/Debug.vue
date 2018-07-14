<template>
  <v-layout fill-height>
    <v-flex xs12>
      <v-btn @click="test1">Kick1</v-btn>
      <v-btn @click="test2">Kick2</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'

import Extension from '../extension'
import * as _debug from '../_debug'

export default Vue.extend({
    data: () => {
        return { name: "hello" }
    },
    methods: {
        async test1() {
            const p = await Extension.api.project.currentProject()
            console.log(p)

            Extension.api.project.importMedia({
                id: p.id,
                files: ["C:/Users/atty/Documents/Adobe/Premiere Pro/12.0/media/001.wav"]
            })
        },

        test2() {
            _debug.debug1()
        }
    }
})
</script>
