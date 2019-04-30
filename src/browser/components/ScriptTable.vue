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
import {Component, Vue} from 'vue-property-decorator';
import {premiereApi, premiereApiClient} from '../global'

@Component({
  components: {
    HotTable,
  }
})
export default class ScriptTable extends Vue {
  readonly hotSettings = {
    data: [],
    rowHeaders: true,
    colHeaders: true,
    filters: true,
    dropdownMenu: true,
    minSpareRows: 1,
    schema: Dialogue,
    colHeaders: ['ID', 'Text'],
    columns: [
      {data: 'id'},
      {data: 'text'},
    ],
    afterChange: this.afterChange.bind(this),
  }

  created() {
    console.log('hot-table created')
  }

  afterChange(change: Array<any>, source: string) {
    console.log('afterChange', change, source)
    if (source === 'loadData') {
      return
    } else if (source == 'edit') {
      const [row, prop, oldValue, newValue] = change
    }
  }
}

class Dialogue {
  id: number
  text: string
}

</script>
