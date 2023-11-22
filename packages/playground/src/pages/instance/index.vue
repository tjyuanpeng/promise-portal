<script setup lang="ts">
import { definePortal } from 'promise-portal'
import Basic, { Input as BasicInput, Output as BasicOutput } from './basic.vue'
import createInstance from './create-instance'

const onBasic = async () => {
  const { pInstance, app } = createInstance()
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    instance: pInstance,
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  app.unmount()
  console.log(result)
}
const onBasic2 = async () => {
  const { pInstance, app } = createInstance({
    unmountDelay: 1000,
  })
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    instance: pInstance,
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  app.unmount()
  console.log(result)
}
const onBasic3 = async () => {
  const { pInstance, app } = createInstance({
    initialShowValue: false,
  })
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    instance: pInstance,
    initialShowValue: true,
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  app.unmount()
  console.log(result)
}
</script>
<template>
  <div class="main">
    <el-card>
      <el-space direction="vertical" alignment="flex-start">
        <el-button @click="onBasic">define portal with custom promise-portal instance</el-button>
        <el-button @click="onBasic2">define portal with unmountDelay option</el-button>
        <el-button @click="onBasic3">define portal with initialShowValue option</el-button>
      </el-space>
    </el-card>
  </div>
</template>
