<template>
  <div></div>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch, Prop} from 'vue-property-decorator'

import {csi} from '../cse'

export type MenuItem = 'scenario' | 'settings'

@Component({})
export default class PanelMenu extends Vue {
  @Prop({default: 'scenario'})
  value: MenuItem

  @Watch('value')
  watchSelectedItem(): void {
    csi.setPanelFlyoutMenu(`
      <Menu>
        <MenuItem Id="scenario" Label="ビュー: 脚本" Enabled="true" Checked="${this.value === 'scenario' ? 'true' : 'false'}"/>
        <MenuItem Id="settings" Label="ビュー: 設定" Enabled="true" Checked="${this.value === 'settings' ? 'true' : 'false'}"/>
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
    this.$emit('input', e.data.menuId)
  }

  private readonly onMenuClickedListener = this.onMenuClicked.bind(this)
}
</script>
