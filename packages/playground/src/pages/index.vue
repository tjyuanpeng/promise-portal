<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const go = (path: string) => {
  router.push(path)
}
</script>
<template>
  <el-card class="main">
    <el-space direction="vertical" alignment="flex-start">
      <el-button @click="go('/basic')">basic</el-button>
      <el-button @click="go('/context')">context</el-button>
      <el-button @click="go('/instance')">instance</el-button>
    </el-space>
  </el-card>
</template>
