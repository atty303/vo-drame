<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar style="min-height: 30px">
        <span>アクター</span>
        <q-select value="<<共通>>" dense outlined dark></q-select>
        <q-btn label="新規作成" icon="add" flat dense size="sm" class="q-mx-sm"></q-btn>
        <q-btn label="複製" icon="file_copy" flat dense size="sm" class="q-mx-sm"></q-btn>
        <q-btn label="削除" icon="delete_outline" flat dense size="sm" class="q-mx-sm"></q-btn>
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
                <div class="row">
                  <div class="col-8">
                    <q-input label="モーショングラフィックス"
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
          </q-expansion-item>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {Component, Vue, Inject, Watch} from 'vue-property-decorator'

@Component({})
export default class SettingsView extends Vue {

}
</script>
