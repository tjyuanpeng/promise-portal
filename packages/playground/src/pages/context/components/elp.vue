<script setup lang="ts">
import { usePortalContext } from 'promise-portal'
import { ref } from 'vue'

export interface Output {
  confirm: boolean
}

const { resolve } = usePortalContext<Output>({ unmountDelay: 100 })
const show = ref(true)
const onConfirm = () => {
  show.value = false
  resolve({ confirm: true })
}
const onClose = () => {
  show.value = false
  resolve({ confirm: false })
}
</script>

<template>
  <el-dialog v-model="show" title="element-plus" width="800" @closed="onClose">
    <el-date-picker />
    <el-table :data="[]">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <template #footer>
      <el-button @click="onClose">
        Cancel
      </el-button>
      <el-button type="primary" @click="onConfirm">
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>
