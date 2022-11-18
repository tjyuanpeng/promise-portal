<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePortalContext } from 'promise-portal'

export interface Input {
  firstName: string
  lastName: string
}

export interface Output {
  fullName: string
  confirm: boolean
}

const props = defineProps<Input>()
const { resolve } = usePortalContext<Output>()

const show = ref(true)
const middleName = ref('patrick')
const fullName = computed(() => `${props.firstName} ${middleName.value} ${props.lastName}`)

const onConfirm = () => {
  resolve({ confirm: true, fullName: fullName.value })
}
const onClose = () => {
  resolve({ confirm: false, fullName: '' })
}
</script>
<template>
  <el-dialog v-model="show" title="Full Name" @closed="onClose">
    <el-form label-width="120px">
      <el-form-item label="first name">
        {{ props.firstName }}
      </el-form-item>
      <el-form-item label="middle name">
        <el-input v-model="middleName" />
      </el-form-item>
      <el-form-item label="last name">
        {{ props.lastName }}
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">Cancel</el-button>
      <el-button type="primary" @click="onConfirm">Confirm</el-button>
    </template>
  </el-dialog>
</template>
