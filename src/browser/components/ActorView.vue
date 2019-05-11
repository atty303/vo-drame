<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar style="min-height: 30px">
        <span>アクター</span>
        <q-select dense outlined dark options-dense
          v-model="selectedActorId"
          :options="orderedActors"
          option-value="id"
          option-label="name"
          emit-value
          map-options
         ></q-select>
        <q-btn label="新規作成" icon="add" flat dense size="sm" class="q-mx-sm" @click="onAddActor"></q-btn>
        <q-btn label="名前の変更" icon="replay" flat dense size="sm" class="q-mx-sm" :disable="!canCopyActor" @click="onRenameActor"></q-btn>
        <q-btn label="複製" icon="file_copy" flat dense size="sm" class="q-mx-sm" :disable="!canCopyActor" @click="onCopyActor"></q-btn>
        <q-btn label="削除" icon="delete_outline" flat dense size="sm" class="q-mx-sm" :disable="!canDeleteActor" @click="onDeleteActor"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="text-white">
        <q-list dark class="q-pt-sm">
          <q-expansion-item label="オーディオ" icon="mic" default-opened dense header-style="border-bottom: 1px solid grey">
            <q-card class="bg-secondary">
              <q-card-section>
                <div class="row q-gutter-sm">
                  <div class="col-2">
                    <q-input value="1" label="トラック" placeholder="1" dense dark standout></q-input>
                  </div>
                  <q-select value="vo:Marionette 東北きりたん" label="エンジン" dense dark standout></q-select>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item label="字幕" icon="subtitles" default-opened dense header-style="border-bottom: 1px solid grey">
            <q-card class="bg-secondary">
              <q-card-section>
                <div class="row q-gutter-sm">
                  <div class="col-2">
                    <q-input value="1" label="トラック" placeholder="1" dense dark standout></q-input>
                  </div>
                  <div class="col-8">
                    <q-input label="モーショングラフィックス"
                      value="モーショングラフィックステンプレートメディア/Subtitle"
                      placeholder="モーショングラフィックステンプレートメディア/字幕"
                      dense dark standout bottom-slots>
                      <template v-slot:hint>
                        <code>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item label="立ち絵" icon="person" default-opened dense header-style="border-bottom: 1px solid grey">
            <q-card class="bg-secondary">
              <q-card-section>
                <div class="row q-gutter-sm">
                  <div class="col-2">
                    <q-input value="2" label="トラック" placeholder="1" dense dark standout></q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch} from 'vue-property-decorator'
import * as uuid from 'uuid'

import * as service from '../service'

interface ActorSubtitle {
  track: number
  mediaPath: string
}

type ActorId = string

interface Actor {
  id: ActorId
  name: string
  subtitle?: ActorSubtitle
}

@Component({})
export default class SettingsView extends Vue {
  @Inject('scenarioService')
  private scenarioService!: service.ScenarioService

  actors: Actor[] = []
  selectedActorId: ActorId = ''

  get orderedActors(): Actor[] {
    const arr = [...this.actors]
    arr.sort((a, b) => {
      if (a.name > b.name) return 1
      else if (a.name < b.name) return -1
      else return 0
    })
    return arr
  }

  get selectedActor(): Actor | undefined {
    return this.actors.find((v) => v.id === this.selectedActorId)
  }

  get canCopyActor(): boolean {
    return this.selectedActorId.length > 0
  }

  get canDeleteActor(): boolean {
    return this.actors.length > 1
  }

  async created() {
    await this.scenarioService.loadActorMetadata()
  }

  onAddActor() {
    this.$q.dialog({
      message: '名前を入力してください',
      prompt: {
        model: '',
        type: 'text'
      },
      cancel: true,
      persistent: true,
    } as any).onOk((name) => {
      const actor = {
        id: uuid.v4(),
        name,
        subtitle: {
          track: 1,
          mediaPath: 'モーショングラフィックステンプレートメディア/字幕',
        },
      }
      this.actors = [...this.actors, actor]
      this.selectedActorId = actor.id
    })
  }

  onRenameActor() {
    const a = this.selectedActor
    if (!a) return

    this.$q.dialog({
      message: '新しい名前を入力してください',
      prompt: {
        model: a.name,
        type: 'text'
      },
      cancel: true,
      persistent: true,
    } as any).onOk((name) => {
      a.name = name
    })
  }

  onCopyActor() {
    const a = this.selectedActor
    if (!a) return

    const actor = {
      id: uuid.v4(),
      name: `${a.name}のコピー`,
      subtitle: {
        track: 1,
        mediaPath: 'モーショングラフィックステンプレートメディア/字幕',
      },
    }
    this.actors = [...this.actors, actor]
    this.selectedActorId = actor.id
  }

  onDeleteActor() {
    const a = this.selectedActor
    if (!a) return

    this.$q.dialog({
      message: `"${a.name}" を削除しますか？`
    } as any).onOk(() => {
      this.actors = this.actors.filter(a => a.id !== this.selectedActorId)
      this.selectedActorId = this.actors.length > 0 ? this.actors[0].id : ''
    })
  }
}
</script>
