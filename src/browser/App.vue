<template>
  <div :style="appStyle">
    <panel-menu v-model="selectedPanelMenu"></panel-menu>
    <scenario-view v-if="selectedPanelMenu === 'scenario'"></scenario-view>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch} from 'vue-property-decorator'
import {colors} from 'quasar'

import {default as PanelMenu, MenuItem} from './components/PanelMenu.vue'
import ScenarioView from './components/ScenarioView.vue'
import {csi} from './cse'

function uiColorToCss(c: any): string {
  return `rgba(${Math.floor(c.red)},${Math.floor(c.green)},${Math.floor(c.blue)},${c.alpha / 255})`
}

@Component({
  components: {
    PanelMenu,
    ScenarioView,
  },
})
export default class App extends Vue {
  selectedPanelMenu: MenuItem = 'scenario'

  get appStyle(): string {
    const skin = csi.getHostEnvironment().appSkinInfo
    const bgColor = uiColorToCss(skin.panelBackgroundColor.color)
    return `font-family: '${skin.baseFontFamily}'; font-size: ${skin.baseFontSize}px; background-color: ${bgColor}`
  }

  async created() {
    this.setSkin()
  }

  setSkin() {
    const skin = csi.getHostEnvironment().appSkinInfo
    colors.setBrand('primary', uiColorToCss(skin.systemHighlightColor))
    colors.setBrand('secondary', uiColorToCss(skin.appBarBackgroundColor.color))
  }
}
</script>
