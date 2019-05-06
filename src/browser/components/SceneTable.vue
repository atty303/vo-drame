<template>
  <q-table
    dense
    flat
    dark
    color="primary"
    hide-bottom
    separator="cell"
    :data="rows"
    :columns="columns"
    :pagination.sync="pagination"
    style="background-color: inherit"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="dialogue" :props="props">
          <!-- autogrow -->
          <q-input :value="props.row.text" borderless dense dark
            @blur="onDialogueBlur($event, props)"
          ></q-input>
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
  @Prop({default: Scene.empty()})
  scene!: Scene

  readonly columns = [
    {
      name: 'dialogue',
      label: '字幕セリフ',
      align: 'left',
    }
  ]

  readonly pagination = {
    rowsPerPage: 0
  }

  get rows(): Dialogue[] {
    return this.scene.dialogues
  }

  // onDialogueInput(text: string, props: any) {
  //   const newArray = [...this.rows]
  //   newArray[props.row.__index].text = text
  //   this.rows = newArray
  // }

  onDialogueBlur(e: any, props: any): void {
    console.log(e)
    const newArray = [...this.rows]
    newArray[props.row.__index].text = e.target.value
    const scene = new Scene({dialogues: newArray})
    this.$emit('sceneChanged', scene)
  }
}
</script>

<style lang="stylus">
.q-field--dense .q-field__control, .q-field--dense .q-field__marginal
  height auto !important
</style>
