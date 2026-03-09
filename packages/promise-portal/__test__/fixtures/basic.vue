<script setup lang="ts">
import { usePortalContext } from '../../src'

export interface Input {
  input: string
}
export interface Output {
  confirm: boolean
}

const props = defineProps<Input>()
const { show, resolve } = usePortalContext<Output>({ initialShowValue: true, unmountDelay: 200 })
const onConfirm = () => {
  resolve({ confirm: true })
}
const onClose = () => {
  resolve({ confirm: false })
}
</script>

<template>
  <el-dialog v-model="show" title="Basic" @closed="onClose">
    <el-form>
      <el-form-item label="input: ">
        {{ props.input }}
      </el-form-item>
    </el-form>
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
