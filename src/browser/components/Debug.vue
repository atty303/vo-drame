<template>
  <v-layout fill-height>
    <v-flex xs12>
      <v-btn @click="test1">Kick1</v-btn>
      <v-btn @click="test2">Kick2</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";

import * as cse from "../cse";
import { premiereApi, premiereApiClient } from "../global";

export default Vue.extend({
  data: () => {
    return { name: "hello" };
  },
  methods: {
    async test1() {
      const p = await premiereApi.project.currentProject();
      console.log(p);

      // premiereApi.project.importMedia({
      //     id: p.id,
      //     files: ["C:/Users/atty/Documents/Adobe/Premiere Pro/12.0/media/001.wav"]
      // })
    },

    async test2() {
      const p2 = await premiereApi.project.getProjectById("f188cfd8-492b-4927-9acb-de4cb628fe30")
      console.log(p2)
    }
  }
});
</script>
