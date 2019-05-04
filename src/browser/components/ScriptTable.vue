<template>
  <div>
    <hot-table
      ref="hot"
      :settings="hotSettings"
      :data="initialData"
      licenseKey="non-commercial-and-evaluation"></hot-table>
  </div>
</template>

<script lang="ts">
import {HotTable} from '@handsontable/vue'
import {Component, Vue, Inject, Emit, Prop} from 'vue-property-decorator';
import {Scene, Dialogue} from '../domain'
import * as service from '../service'
import { HotTableComponent, HotTableData } from '@handsontable/vue/types';
import Handsontable from 'handsontable';

@Component({
  components: {
    HotTable,
  }
})
export default class ScriptTable extends Vue {
  @Inject('scenarioService')
  private scenarioService!: service.ScenarioService

  @Prop({default: new Scene()})
  initialScene!: Scene

  readonly hotSettings = {
    rowHeaders: true,
    colHeaders: ['ID', 'Text'],
    filters: true,
    contextMenu: true,
    dropdownMenu: true,
    //minSpareRows: 1,
    schema: Dialogue,
    columns: [
      {data: 'id'},
      {data: 'text'},
    ],
    afterChange: this.afterChange.bind(this),
  }

  get initialData() {
    return this.initialScene.dialogues
  }

  get hot(): Handsontable {
    return (this.$refs.hot as any).hotInstance
  }

  get scene(): Scene {
    const scene = new Scene()
    scene.dialogues = this.hot.getSourceData() as any
    return scene
  }

  async mounted() {
  }

  @Emit()
  sceneChanged(): Scene {
    return this.scene
  }

  afterChange(change: Array<any>, source: string) {
    //console.log('afterChange', change, source)
    if (source === 'loadData') {
      return
    } else if (source == 'edit') {
      const [row, prop, oldValue, newValue] = change
      this.sceneChanged()
    }
  }
}

</script>
