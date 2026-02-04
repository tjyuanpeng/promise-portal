<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/zh_CN'
import { ContextProvider } from 'promise-portal'
</script>

<template>
  <a-config-provider :locale="locale">
    <ContextProvider>
      <router-view />
    </ContextProvider>
  </a-config-provider>
</template>
