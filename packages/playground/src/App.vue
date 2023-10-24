<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { definePortal, createPromisePortal, getActiveInstance, setActiveInstance } from 'promise-portal'
import Basic, { Input as BasicInput, Output as BasicOutput } from './components/basic.vue'
import FlowA, { Output as FlowAOutput } from './components/flow-a.vue'
import FlowB, { Output as FlowBOutput } from './components/flow-b.vue'
import NestedA, { Output as NestedAOutput } from './components/nested-a.vue'

const basic = definePortal<BasicOutput, BasicInput>(Basic)
const getA = definePortal<FlowAOutput>(FlowA)
const getB = definePortal<FlowBOutput>(FlowB)
const getNestedA = definePortal<NestedAOutput>(NestedA)

const onBasic = async () => {
  const data = await basic({ input: 'foo bar.' })
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
  const func = definePortal(Basic, { unmountDelay: 202 })
  const data = await func({ input: 'foo bar.' })
  ElMessage(JSON.stringify(data))
}
</script>
<template>
  <div class="main">
    <el-card>
      <el-button @click="onBasic"> basic usage </el-button>
      <el-divider />
      <el-button @click="onFlow"> flow usage </el-button>
      <el-divider />
      <el-button @click="onNested"> nested usage </el-button>
      <el-divider />
      <el-button @click="onDelay"> unmountDelay usage </el-button>
    </el-card>
  </div>
</template>
<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

.main {
  max-width: 1000px;
  margin: 100px auto;
}

:deep(.el-divider) {
  margin: 20px 0;
}
</style>
