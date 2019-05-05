<template>
  <q-table
    dense
    flat
    color="primary"
    hide-bottom
    separator="cell"
    :data="rows"
    :columns="columns"
    :pagination.sync="pagination"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="dialog" :props="props">
          {{ props.row.text }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import {Component, Vue, Inject, Emit, Prop} from 'vue-property-decorator';
import {Scene, Dialogue} from '../domain'

@Component({
  components: {
  }
})
export default class SceneTable extends Vue {
  @Prop({default: new Scene()})
  initialScene!: Scene

  readonly columns = [
    {
      name: 'dialog',
      label: '台詞',
      align: 'left',
    }
  ]

  readonly pagenation = {
    rowsPerPage: 0
  }

  get rows() {
    return this.initialScene.dialogues
  }
}
</script>
