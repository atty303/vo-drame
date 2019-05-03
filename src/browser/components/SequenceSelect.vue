<template>
  <q-select outlined dense options-dense dark hide-bottom-space
    :value="value"
    :options="sequences"
    option-value="sequenceId"
    option-label="name"
    emit-value
    map-options
    @focus="onFocus"
    @input="onInput"
  ></q-select>
</template>

<script lang="ts">
import {Component, Vue, Inject, Emit, Prop} from 'vue-property-decorator'

import * as service from '../service'
import { Premiere } from '../../shared';

@Component({})
export default class SequenceSelect extends Vue {
  @Inject('scenarioService')
  private scenarioService!: service.ScenarioService

  @Prop({required: true})
  value: Premiere.SequenceId

  sequences: Premiere.Sequence[] = []

  @Emit()
  input(value: Premiere.SequenceId) {
  }

  async created() {
    this.sequences = await this.scenarioService.getSequences()
  }

  async onFocus() {
    this.sequences = await this.scenarioService.getSequences()
  }

  onInput(value: Premiere.SequenceId) {
    this.input(value)
  }
}
</script>
