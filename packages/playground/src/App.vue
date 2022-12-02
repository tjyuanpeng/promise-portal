<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { definePortal } from 'promise-portal'
import Basic, { Input as BasicInput, Output as BasicOutput } from './components/basic.vue'
import PlusA, { Output as PlusAOutput } from './components/plus-a.vue'
import PlusB, { Output as PlusBOutput } from './components/plus-b.vue'

const basic = definePortal<BasicOutput, BasicInput>(Basic, { unmountDelay: 202 })
const getA = definePortal<PlusAOutput>(PlusA)
const getB = definePortal<PlusBOutput>(PlusB)

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
  const a = await getA()
  if (a.value === null) {
    return
  }
  const b = await getB()
  if (b.value === null) {
    return
  }
  console.log(Number(a.value) + Number(b.value))
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
