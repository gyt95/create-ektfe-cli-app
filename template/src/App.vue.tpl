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
    title: '<%= viewTitle %>',
    icon: '<%= projectName %>-icon',
    code: '<%= viewName %>',
    num: 0,
  }
]

const getCurrView = computed(() => VIEW[unref(currView) as keyof typeof VIEW])
const VIEW = {
  <%= viewName %>: defineAsyncComponent(
    () => import('@/containers/<%= viewName %>/index.vue')
  ),
}
</script>

<style lang="less" scoped></style>
