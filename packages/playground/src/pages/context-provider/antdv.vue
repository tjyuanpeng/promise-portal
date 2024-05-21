<script setup lang="ts">
import { usePortalContext } from 'promise-portal'

export interface Output {
  confirm: boolean
}
const { resolve, show } = usePortalContext<Output>({ unmountDelay: 200 })
const columns = [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'age',
    dataIndex: 'age',
  },
  {
    title: 'address',
    dataIndex: 'address',
  },
]
const onClose = () => {
  resolve({ confirm: false })
}
</script>
<template>
  <a-modal v-model:open="show" title="antdv modal" width="800px" @cancel="onClose">
    <a-date-picker />
    <a-table :data-source="[]" :columns="columns" />
    <template #footer>
      <a-button @click="onClose">close</a-button>
    </template>
  </a-modal>
</template>
