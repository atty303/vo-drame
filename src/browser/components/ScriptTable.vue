<template>
  <div>
    <hot-table
      v-if="visible"
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

  @Prop({default: () => new Scene()})
  initialScene!: Scene

  readonly hotSettings = {
    rowHeaders: true,
    colHeaders: ['ID', '台詞'],
    colWidths: [0, '400'],
    hiddenColumns: {
      columns: [0],
      indicators: false,
    },
    manualRowMove: true,
    //width: '95vw',
    height: 'calc(100vh - 50px)',
    filters: true,
    allowInsertColumn: false,
    allowRemoveColumn: false,
    autoWrapCol: false,
    autoWrapRow: false,
    dataSchema: () => Dialogue.empty(),
    columns: [
      {data: 'id', skipColumnOnPaste: true},
      {data: 'text'},
    ],
    contextMenu: {
      items: {
        'row_above': { name: '行を上に挿入' },
        'row_below': { name: '行を下に挿入' },
        '---------': {},
        'remove_row': { name: '行を削除' },
      }
    },
    dropdownMenu: {
      items: {
        'filter_by_condition': {},
        'filter_operators': {},
        'filter_by_condition2': {},
        'filter_by_value': {},
        'filter_action_bar': {},
      }
    },
    afterChange: this.onAfterChange.bind(this),
    afterCreateRow: () => this.sceneChanged(),
    afterRemoveRow: () => this.sceneChanged(),
    afterRowMove: () => this.sceneChanged(),
  }

  get initialData() {
    return this.initialScene.dialogues
  }

  get visible() {
    return this.initialScene.nonEmpty
  }

  //@Emit()
  sceneChanged(): Scene {
    const hot = (this.$refs.hot as any).hotInstance
    const dialogues = hot.getData().map(arr => new Dialogue({id: arr[0], text: arr[1]}))
    const scene = new Scene({ dialogues })
    this.$emit('sceneChanged', scene)
    return scene
  }

  onAfterChange(change: Array<any>, source: string) {
    // console.log('afterChange', change, source)
    if (source === 'loadData') {
      return
    } else if (source === 'edit') {
      const [row, prop, oldValue, newValue] = change
      this.sceneChanged()
    }
  }
}

</script>
