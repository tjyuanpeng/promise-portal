<script setup lang="ts">
import { definePortal } from 'promise-portal'
import locale from 'ant-design-vue/es/locale/zh_CN'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Antdv, { Output as AntdvBOutput } from './antdv.vue'
import Elp, { Output as ElpBOutput } from './elp.vue'

const [showAntdv, AntdvContextHolder] = definePortal<AntdvBOutput>(Antdv)
const onAntdv = async () => {
  const result = await showAntdv()
  console.log(result)
}
const [showElp, ElpContextHolder] = definePortal<ElpBOutput>(Elp)
const onElp = async () => {
  const result = await showElp()
  console.log(result)
}
const [showNoContext] = definePortal<AntdvBOutput>(Antdv)
const onNoContext = async () => {
  const result = await showNoContext()
  console.log(result)
}
</script>
<template>
  <div class="main">
    <a-config-provider :locale="locale">
      <AntdvContextHolder />
    </a-config-provider>
    <el-config-provider :locale="zhCn">
      <ElpContextHolder />
    </el-config-provider>
    <el-card>
      <el-space direction="vertical" alignment="flex-start">
        <el-button @click="onAntdv">antdv context holder case</el-button>
        <el-button @click="onNoContext">without context holder case</el-button>
        <el-button @click="onElp">element-plus context holder case</el-button>
      </el-space>
    </el-card>
  </div>
</template>
