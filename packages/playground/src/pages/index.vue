<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import routes from '~pages'

const router = useRouter()
const list = routes.filter(i => i.path !== '/').sort((a, b) => a.path.localeCompare(b.path))
const go = (item: RouteRecordRaw) => router.push(item.path)
</script>

<template>
  <el-card class="main" header="Promise Portal Playground">
    <el-space direction="vertical" alignment="flex-start">
      <el-button v-for="item in list" :key="item.path" @click="go(item)">
        {{ item.name ?? item.path.slice(1) }}
      </el-button>
    </el-space>
  </el-card>
</template>
