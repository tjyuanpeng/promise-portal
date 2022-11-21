<script setup lang="ts">
import { definePortal } from 'promise-portal'
import Comp, { Input, Output } from './components/name.vue'
import PlusA, { Output as PlusAOutput } from './components/plus-a.vue'
import PlusB, { Output as PlusBOutput } from './components/plus-b.vue'

const func = definePortal<Output, Input>(Comp)
const getA = definePortal<PlusAOutput>(PlusA)
const getB = definePortal<PlusBOutput>(PlusB)

const onClick = async () => {
  const data = await func({ firstName: 'joe', lastName: 'watson' })
  console.log(data)
  if (!data.confirm) {
    return
  }
  alert(data.fullName)
}
const onPlus = async () => {
  const a = await getA()
  if (a.value === null) {
    return
  }
  const b = await getB()
  if (b.value === null) {
    return
  }
  setTimeout(() => {
    alert(Number(a.value) + Number(b.value))
  }, 100)
}
</script>
<template>
  <div><el-button @click="onClick"> click to open the Dialog </el-button></div>
  <div><el-button @click="onPlus"> plus flow </el-button></div>
</template>
