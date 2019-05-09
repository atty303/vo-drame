<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar style="min-height: 30px">
        <span>シーケンス</span>
        <sequence-select v-model="selectedSequenceId" class="q-mx-xs"></sequence-select>
        <q-btn label="新規作成" icon="add" size="sm" flat dense
          v-if="canAdd"
          @click="onAdd"
        ></q-btn>
        <q-btn label="同期" icon="sync" size="sm" flat dense
          v-if="!canAdd"
          :loading="isSyncing"
          :disable="!canSync"
          @click="onSync"
        ></q-btn>
        <q-separator vertical inset dark class="q-mx-sm"></q-separator>
        <q-space></q-space>
        <q-btn label="再読み込み" icon="build" size="sm" flat dense @click="onRefresh"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding>
        <script-table :scene="scene" @sceneChanged="onSceneChanged"></script-table>
        <!--scene-table :scene="scene" @sceneChanged="onSceneChanged"></scene-table-->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch} from 'vue-property-decorator'

import SceneTable from './SceneTable.vue'
import ScriptTable from './ScriptTable.vue'
import SequenceSelect from './SequenceSelect.vue'

import {Scene} from '../domain'
import * as service from '../service'
import {csi} from '../cse'
import {Premiere} from '../../shared'

@Component({
  components: {
    ScriptTable,
    SequenceSelect,
    SceneTable,
  },
})
export default class ScenarioView extends Vue {
  @Inject('scenarioService')
  private scenarioService!: service.ScenarioService

  scene: Scene = Scene.empty()
  isSyncing: boolean = false
  selectedSequenceId: Premiere.SequenceId = ''

  get canAdd(): boolean {
    return this.scene.isEmpty
  }

  get canSync(): boolean {
    return this.selectedSequenceId.length > 0 && this.scene.nonEmpty
  }

  async created() {
    const id = localStorage.getItem('selectedSequenceId')
    if (id) this.selectedSequenceId = id
  }

  @Watch('selectedSequenceId')
  async onSelectedSequenceIdChanged(): Promise<void> {
    localStorage.setItem('selectedSequenceId', this.selectedSequenceId)

    if (this.selectedSequenceId) {
      this.scene = await this.scenarioService.loadScene(this.selectedSequenceId) || Scene.empty()
    }
  }

  onRefresh(): void {
    location.reload()
  }

  onSceneChanged(scene: Scene): void {
    //console.log('onSceneChanged', scene)
    this.scene = scene
    if (this.selectedSequenceId) {
      this.scenarioService.saveScene(this.selectedSequenceId, this.scene)
    }
  }

  async onAdd(): Promise<void> {
    this.onSceneChanged(Scene.newTemplate())
  }

  async onSync(): Promise<void> {
    if (this.isSyncing || !this.selectedSequenceId) {
      return
    }
    this.isSyncing = true
    await this.scenarioService.syncScene(this.selectedSequenceId, this.scene)
    this.isSyncing = false
  }
}
</script>
