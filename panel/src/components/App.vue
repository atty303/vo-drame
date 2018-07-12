<template>
    <div>
        {{name}} !!!
        <button @click="reload">reload</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Extension from '../extension'

export default Vue.extend({
    data: () => {
        return { name: "hello" }
    },
    methods: {
        reload() {
            Extension.reload()
        }
    }
})
</script>
