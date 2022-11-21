<script setup lang="ts">
import { ref } from 'vue'
import { usePortalContext } from 'promise-portal'

export interface Output {
  value: string | null
}

const { resolve } = usePortalContext<Output>()
const value = ref('')
const onConfirm = () => {
  resolve({ value: value.value })
}
const onClose = () => {
  resolve({ value: null })
}
</script>
<template>
  <el-dialog :model-value="true" title="Full Name" @closed="onClose">
    <el-form>
      <el-form-item label="enter another number">
        <el-input v-model="value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">Cancel</el-button>
      <el-button type="primary" @click="onConfirm">Confirm</el-button>
    </template>
  </el-dialog>
</template>
