<template>
  <v-app dark>
    <v-toolbar fixed flat height="30px">
      <v-toolbar-items>
        <v-btn flat>Debug</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <debug />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Debug from "./components/Debug.vue";

export default Vue.extend({
  name: "App",
  components: {
    Debug
  }
});
</script>
