<script setup lang="ts">
import { ref } from 'vue'
import { usePortalContext, definePortal } from 'promise-portal'
import NestedB, { Output as NestedBOutput } from './nested-b.vue'

export interface Output {
  value: string | null
}

const getNestedB = definePortal<NestedBOutput>(NestedB)

const { resolve } = usePortalContext<Output>()
const value = ref('')
const show = ref(true)
const onConfirm = async () => {
  const b = await getNestedB()
  if (b.value === null) {
    resolve({ value: null })
    return
  }
  resolve({ value: String(Number(value.value) + Number(b.value)) })
}
const onClose = () => {
  resolve({ value: null })
}
</script>
<template>
  <el-dialog v-model="show" title="Nested A" @closed="onClose">
    <el-form>
      <el-form-item label="enter a number22">
        <el-input v-model="value" autofocus />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">Cancel</el-button>
      <el-button type="primary" @click="onConfirm">Confirm</el-button>
    </template>
  </el-dialog>
</template>
