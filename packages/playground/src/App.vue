<script setup lang="ts">
import { ref } from 'vue'
import { definePortal } from 'promise-portal'
import Comp, { Input, Output } from './components/name.vue'

const func = definePortal<Output, Input>(Comp)

const result = ref('')
const onClick = async () => {
  const data = await func({ firstName: 'joe', lastName: 'watson' })
  console.log(data)
  if (!data.confirm) {
    return
  }
  result.value = data.fullName
}
</script>
<template>
  <div><el-button @click="onClick"> click to open the Dialog </el-button> - {{ result }}</div>
</template>
