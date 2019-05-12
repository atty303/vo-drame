<template>
  <div>
    <hot-table
      v-if="visible"
      ref="hot"
      :data="rows"
      :settings="hotSettings"
      licenseKey="non-commercial-and-evaluation"></hot-table>
  </div>
</template>

<script lang="ts">
import {HotTable} from '@handsontable/vue'
import {Component, Vue, Inject, Emit, Prop, Watch} from 'vue-property-decorator';
import {Scene, Dialogue, Actor} from '../domain'
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

  @Prop({default: () => Scene.empty()})
  scene!: Scene

  actors: Actor[] = []

  readonly hotSettings = {
    rowHeaders: true,
    colHeaders: ['ID', 'アクター', 'セリフ', '間'],
    //colWidths: [0, 100, 250, 40],
    columns: [
      {data: 'id', skipColumnOnPaste: true},
      {
        data: 'actor',
        type: 'dropdown',
        source: this.provideActorSource.bind(this),
      },
      {data: 'text'},
      {data: 'margin', type: 'numeric'},
    ],
    hiddenColumns: {
      columns: [0],
      indicators: false,
    },
    //manualRowMove: true,
    width: '95vw',
    height: 'calc(100vh - 50px)',
    filters: true,
    allowInsertColumn: false,
    allowRemoveColumn: false,
    autoWrapCol: false,
    autoWrapRow: false,
    dataSchema: () => Dialogue.empty(),
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

  get rows() {
    return this.scene.dialogues
  }

  get visible() {
    return this.scene.nonEmpty
  }

  async created() {
    this.actors = await this.scenarioService.loadActorMetadata()
  }

  provideActorSource(query, cb) {
    cb(this.actors.map(a => a.name))
  }

  //@Emit()
  sceneChanged(): Scene {
    const hot = (this.$refs.hot as any).hotInstance
    const dialogues = hot.getSourceData().map(r => {
      const margin = parseFloat(r.margin)
      return new Dialogue({
        id: r.id,
        text: r.text,
        margin: isNaN(margin) ? undefined : margin,
      })
    })
    const scene = new Scene({ dialogues })
    //console.log(dialogues)
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
