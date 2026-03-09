<script setup lang="ts">
import type { Output as ElpBOutput } from './elp.vue'
import { definePortal } from 'promise-portal'
import Elp from './elp.vue'

const [showElp] = definePortal<ElpBOutput>(Elp)
const onElp = async () => {
  const result = await showElp()
  console.log(result)
}
</script>

<template>
  <el-button @click="onElp">
    element-plus context from current instance
  </el-button>
</template>
