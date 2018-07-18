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

import * as cse from '../cse'
import { premiereApi } from '../global'

export default Vue.extend({
    data: () => {
        return { name: "hello" }
    },
    methods: {
        async test1() {
            const p = await premiereApi.project.currentProject()
            console.log(p)

            // premiereApi.project.importMedia({
            //     id: p.id,
            //     files: ["C:/Users/atty/Documents/Adobe/Premiere Pro/12.0/media/001.wav"]
            // })
        },

        test2() {
        }
    }
})
</script>
