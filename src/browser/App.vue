<template>
  <div :style="appStyle">
    <panel-menu v-model="selectedPanelMenu"></panel-menu>
    <scenario-view v-if="selectedPanelMenu === 'scenario'"></scenario-view>
    <actor-view v-if="selectedPanelMenu === 'actor'"></actor-view>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch} from 'vue-property-decorator'
import {colors} from 'quasar'

import {default as PanelMenu, MenuItem} from './components/PanelMenu.vue'
import ScenarioView from './components/ScenarioView.vue'
import ActorView from './components/ActorView.vue'
import {csi} from './cse'
import {CSInterface} from 'csinterface-ts'

function uiColorToCss(c: any): string {
  return `rgba(${Math.floor(c.red)},${Math.floor(c.green)},${Math.floor(c.blue)},${c.alpha / 255})`
}

@Component({
  components: {
    PanelMenu,
    ScenarioView,
    ActorView,
  },
})
export default class App extends Vue {
  selectedPanelMenu: MenuItem = 'scenario'
  skin: any = csi.getHostEnvironment().appSkinInfo

  get appStyle(): string {
    const bgColor = uiColorToCss(this.skin.panelBackgroundColor.color)
    return `font-family: '${this.skin.baseFontFamily}'; font-size: ${this.skin.baseFontSize}px; background-color: ${bgColor}`
  }

  async created() {
    csi.addEventListener('com.adobe.csxs.events.ThemeColorChanged', this.onAppThemeChangedListener)
    this.onAppThemeChanged()
  }

  beforeDestroy() {
    csi.removeEventListener('com.adobe.csxs.events.ThemeColorChanged', this.onAppThemeChangedListener)
  }

  onAppThemeChanged() {
    this.skin = csi.getHostEnvironment().appSkinInfo
    colors.setBrand('primary', uiColorToCss(this.skin.systemHighlightColor))
    colors.setBrand('secondary', uiColorToCss(this.skin.appBarBackgroundColor.color))
  }

  private readonly onAppThemeChangedListener = this.onAppThemeChanged.bind(this)
}
</script>
