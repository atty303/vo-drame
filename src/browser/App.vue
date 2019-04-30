<template>
  <v-app dark>
    <v-toolbar fixed flat height="30px">
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <div>
          <script-table></script-table>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import Debug from './components/Debug.vue'
import ScriptTable from './components/ScriptTable.vue'

@Component({
  components: {
    Debug,
    ScriptTable,
  }
})
export default class App extends Vue {
}
</script>
