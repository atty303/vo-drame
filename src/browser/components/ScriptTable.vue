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

@Component({
  components: {
    HotTable,
  }
})
export default class ScriptTable extends Vue {
  readonly hotSettings = {
    data: [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2016", 10, 11, 12, 13],
      ["2017", 20, 11, 14, 13],
      ["2018", 30, 15, 12, 13]
    ],
    rowHeaders: true,
    colHeaders: true,
  }

  created() {
    console.log('hot-table created')
  }
}

</script>
