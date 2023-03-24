<template>
  <a-config-provider>
    <TheContainer name="dispatch">
      <component ref="viewbox" :is="getCurrView"></component>
    </TheContainer>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useGlobalStore } from '@next/core'
const globalStore = useGlobalStore()
const { currView } = toRefs(globalStore)

const getCurrView = computed(() => {
  if (currView.value === 'xxxView')
    return defineAsyncComponent(() => import('@/containers/xxxView/index.vue'))
})
</script>

<style lang="less" scoped></style>
