<script setup lang="ts">
import type { Input as BasicInput, Output as BasicOutput } from './components/basic.vue'
import type { Output as FlowAOutput } from './components/flow-a.vue'
import type { Output as FlowBOutput } from './components/flow-b.vue'
import type { Output as NestedAOutput } from './components/nested-a.vue'
import { definePortal } from 'promise-portal'
import Basic from './components/basic.vue'
import FlowA from './components/flow-a.vue'
import FlowB from './components/flow-b.vue'
import NestedA from './components/nested-a.vue'

const [basic] = definePortal<BasicOutput, BasicInput>(Basic)
const [getA] = definePortal<FlowAOutput>(FlowA)
const [getB] = definePortal<FlowBOutput>(FlowB)
const [getNestedA] = definePortal<NestedAOutput>(NestedA)

const onBasic = async () => {
  const data = await basic({ input: 'basic usage input value' })
  ElMessage(JSON.stringify(data))
}

const onFlow = async () => {
  const a = await getA()
  if (a.value === null) {
    return
  }
  const b = await getB()
  if (b.value === null) {
    return
  }
  ElMessage(`result is ${Number(a.value) + Number(b.value)}`)
}

const onNested = async () => {
  const v = await getNestedA()
  if (v.value === null) {
    return
  }
  ElMessage(`result is ${v.value}`)
}

const onDelay = async () => {
  const [func] = definePortal(Basic, { unmountDelay: 200 })
  const data = await func({ input: 'delay to unmount' })
  ElMessage(JSON.stringify(data))
}
</script>

<template>
  <div class="main">
    <el-card>
      <el-space direction="vertical" alignment="flex-start">
        <el-button @click="onBasic">
          Basic usage Case
        </el-button>
        <el-button @click="onDelay">
          set unmountDelay to delay the call of unmount, preserve the gap to modal hidding animation.
        </el-button>
        <el-button @click="onFlow">
          Sequential Call Case
        </el-button>
        <el-button @click="onNested">
          Nested Call Case
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>
