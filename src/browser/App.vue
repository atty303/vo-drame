<template>
  <q-layout view="hHh Lpr lFf" :style="appStyle">
    <q-header>
      <q-toolbar class="" style="min-height: 30px">
        <span class="q-mr-xs">シーン</span>
        <q-input outlined dense options-dense dark hide-bottom-space></q-input>
        <q-icon name="link" class="q-mx-xs"></q-icon>
        <span class="q-mr-xs">シーケンス</span>
        <q-input outlined dense options-dense dark hide-bottom-space></q-input>
        <q-separator vertical inset dark class="q-mx-sm"></q-separator>
        <q-space></q-space>
        <q-btn label="同期" icon="sync" size="xs" flat dense :loading="isSyncing" @click="onSync"></q-btn>
        <q-btn label="Refresh" size="xs" flat dense @click="onRefresh"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding>
        <script-table :initialScene="scene" @sceneChanged="onSceneChanged"></script-table>
        <debug></debug>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {Component, Vue, Inject} from 'vue-property-decorator'
import Debug from './components/Debug.vue'
import ScriptTable from './components/ScriptTable.vue'
import {Scene} from './domain'
import * as service from './service'
import {csi} from './cse'
import {colors} from 'quasar'

@Component({
  components: {
    Debug,
    ScriptTable,
  }
})
export default class App extends Vue {
  @Inject('scenarioService')
  private scenarioService!: service.ScenarioService

  scene: Scene = new Scene()
  isSyncing: boolean = false

  get appStyle(): string {
    const skin = csi.getHostEnvironment().appSkinInfo
    const bgColor = this.uiColorToCss(skin.panelBackgroundColor.color)
    return `font-family: '${skin.baseFontFamily}'; font-size: ${skin.baseFontSize}px; background-color: ${bgColor}`
  }

  async created() {
    const skin = csi.getHostEnvironment().appSkinInfo
    console.log(skin.systemHighlightColor)
    colors.setBrand('primary', this.uiColorToCss(skin.systemHighlightColor))
    colors.setBrand('secondary', this.uiColorToCss(skin.appBarBackgroundColor.color))

    this.scene = await this.scenarioService.loadScene()
  }

  private uiColorToCss(c: any): string {
    return `rgba(${Math.floor(c.red)},${Math.floor(c.green)},${Math.floor(c.blue)},${c.alpha / 255})`
  }

  onRefresh(): void {
    location.reload()
  }

  onSceneChanged(scene: Scene): void {
    console.log('onSceneChanged', scene)
    this.scene = scene
  }

  async onSync(): Promise<void> {
    if (this.isSyncing) {
      return
    }
    this.isSyncing = true
    await this.scenarioService.syncScene(this.scene)
    this.isSyncing = false
  }
}
</script>

<style lang="stylus">
.q-layout__section--marginal {
    background-color: var(--q-color-secondary) !important;
    color: #fff;
}
</style>


