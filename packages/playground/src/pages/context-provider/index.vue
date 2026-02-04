<script setup lang="ts">
import type { Output as AntdvBOutput } from './components/antdv.vue'
import { definePortal } from 'promise-portal'
import Antdv from './components/antdv.vue'

const [showAntdv] = definePortal<AntdvBOutput>(Antdv)
const onAntdv = async () => {
  const result = await showAntdv()
  console.log(result)
}
</script>

<template>
  <div class="main">
    <el-card>
      <el-space direction="vertical" alignment="flex-start">
        <el-button @click="onAntdv">
          context provider case
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>
