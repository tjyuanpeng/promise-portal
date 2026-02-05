<script setup lang="ts">
import type { Input as BasicInput, Output as BasicOutput } from './components/basic.vue'
import { definePortal } from 'promise-portal'
import Basic from './components/basic.vue'

const onBasic = async () => {
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    appendTo: () => document.body,
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  console.log(result)
}
const onBasic2 = async () => {
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    appendTo: '#custom-container',
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  console.log(result)
}
const customContainerRef = ref()
const onBasic3 = async () => {
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    appendTo: customContainerRef,
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  console.log(result)
}
const onBasic4 = async () => {
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    appendTo: customContainerRef.value,
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  console.log(result)
}
const onBasic5 = async () => {
  const [showBasicModal] = definePortal<BasicOutput, BasicInput>(Basic, {
    appendTo: '#error',
  })
  const result = await showBasicModal({ input: 'basic usage input value' })
  console.log(result)
}
</script>

<template>
  <div class="main">
    <el-card>
      <el-space direction="vertical" alignment="flex-start">
        <el-button @click="onBasic">
          append portal container to body using a function call
        </el-button>
        <el-button @click="onBasic2">
          append portal container to a custom selector
        </el-button>
        <el-button @click="onBasic3">
          append portal container to a Ref value
        </el-button>
        <el-button @click="onBasic4">
          append portal container to a custom element
        </el-button>
        <el-button @click="onBasic5">
          set error value to append
        </el-button>
      </el-space>
    </el-card>
    <div id="custom-container" ref="customContainerRef">
      #custom-container
    </div>
  </div>
</template>

<style scoped>
#custom-container {
  margin-top: 12px;
  height: 50px;
  border: 1px solid #ddd;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
