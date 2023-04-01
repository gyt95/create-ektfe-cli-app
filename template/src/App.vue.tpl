<template>
  <a-config-provider>
    <<%= platformCapitalized %>ProLayout :menu="MENU">
      <component ref="viewbox" :is="getCurrView"></component>
    </<%= platformCapitalized %>ProLayout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@<%= platformName %>/core'
const globalStore = useGlobalStore()
const { currView } = toRefs(globalStore)

const MENU = [
  {
    title: '模块标题',
    icon: 'aaa-icon',
    code: 'XxxView',
    num: 0
  }
]

const getCurrView = computed(() => {
  if (currView.value === 'xxxView')
    return defineAsyncComponent(() => import('@/containers/xxxView/index.vue'))
})
</script>

<style lang="less" scoped></style>
