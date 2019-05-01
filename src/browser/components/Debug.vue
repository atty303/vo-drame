<template>
  <div>
    <q-btn label="1" color="white" text-color="black" @click="test1"></q-btn>
    <q-btn label="2" color="white" text-color="black" @click="test2"></q-btn>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Inject} from 'vue-property-decorator'

import * as cse from "../cse"
import {premiereApi} from '../global'
import {Premiere} from '../../shared'

@Component({})
export default class Debug extends Vue {
  @Inject('api')
  api!: Premiere.Api

  async test1() {
    //const p = await premiereApi.project.currentProject()
    //console.log(p)

    const p2 = await this.api.helper.version()
    console.log(p2)

    // premiereApi.project.importMedia({
    //     id: p.id,
    //     files: ["C:/Users/atty/Documents/Adobe/Premiere Pro/12.0/media/001.wav"]
    // })
  }

  async test2() {
    const p2 = await premiereApi.project.getProjectById("f188cfd8-492b-4927-9acb-de4cb628fe30")
    console.log(p2)
  }
}
</script>
