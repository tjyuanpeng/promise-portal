<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
</script>
<template>
  <el-button text @click="dialogVisible = true"> click to open the Dialog </el-button>
  <el-dialog v-model="dialogVisible" title="Tips">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
