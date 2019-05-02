<template>
  <div>
    <hot-table
      ref="hot"
      :settings="hotSettings"
      licenseKey="non-commercial-and-evaluation"></hot-table>
  </div>
</template>

<script lang="ts">
import {HotTable} from '@handsontable/vue'
import {Component, Vue, Inject} from 'vue-property-decorator';
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

  readonly hotSettings = {
    data: [],
    rowHeaders: true,
    colHeaders: ['ID', 'Text'],
    filters: true,
    dropdownMenu: true,
    minSpareRows: 1,
    schema: Dialogue,
    columns: [
      {data: 'id'},
      {data: 'text'},
    ],
    afterChange: this.afterChange.bind(this),
  }

  get hot(): Handsontable {
    return (this.$refs.hot as any).hotInstance
  }

  async created() {
    console.log('hot-table created')
    const scene = await this.scenarioService.loadScene()
    if (scene) {
      this.hot.loadData(scene.dialogues)
    }
  }

  afterChange(change: Array<any>, source: string) {
    console.log('afterChange', change, source)
    if (source === 'loadData') {
      return
    } else if (source == 'edit') {
      const [row, prop, oldValue, newValue] = change
    }

    console.log(this.hot.getSourceData());
    const scene = new Scene()
    scene.dialogues = this.hot.getSourceData() as any
    this.scenarioService.saveScene(scene)
  }
}

</script>
