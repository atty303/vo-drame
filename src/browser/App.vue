<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar class="shadow-2">
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding>
        <debug></debug>
        <script-table></script-table>
      </q-page>
    </q-page-container>
  </q-layout>
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
