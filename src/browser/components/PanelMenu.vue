<template>
  <div></div>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch, Prop} from 'vue-property-decorator'

import {csi} from '../cse'

export type MenuItem = 'scenario' | 'actor' | 'reload'

@Component({})
export default class PanelMenu extends Vue {
  @Prop({default: 'scenario'})
  value: MenuItem

  @Watch('value')
  watchSelectedItem(): void {
    csi.setPanelFlyoutMenu(`
      <Menu>
        <MenuItem Id="scenario" Label="ビュー: シナリオ" Enabled="true" Checked="${this.value === 'scenario' ? 'true' : 'false'}"/>
        <MenuItem Id="actor" Label="ビュー: アクター" Enabled="true" Checked="${this.value === 'actor' ? 'true' : 'false'}"/>
        <MenuItem Label="---"/>
        <MenuItem Id="reload" Label="再読み込み" Enabled="true"/>
      </Menu>
    `)
  }

  created() {
    csi.addEventListener('com.adobe.csxs.events.flyoutMenuClicked', this.onMenuClickedListener)
    this.watchSelectedItem()
  }

  beforeDestroy() {
    csi.removeEventListener('com.adobe.csxs.events.flyoutMenuClicked', this.onMenuClickedListener)
  }

  onMenuClicked(e) {
    if (e.data.menuId === 'reload') {
      location.reload()
    } else {
      this.$emit('input', e.data.menuId)
    }
  }

  private readonly onMenuClickedListener = this.onMenuClicked.bind(this)
}
</script>
