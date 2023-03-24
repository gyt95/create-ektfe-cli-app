<template>
  <div class="dining-box per-height">
    <a-card class="dining-lis per-height">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in TABS" :label="item.label" :name="item.prop">
          <component :is="item.component"></component>
        </el-tab-pane>
      </el-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
const activeName = ref('firstTab')

const TABS = [
  {
    label: 'xxx',
    prop: 'firstTab',
    component: defineAsyncComponent(() => import('./components/Info.vue')),
  },
]
</script>

<style lang="less" scoped>
:deep(.el-card__body) {
  height: 93%;
}
:deep(.el-tabs),
:deep(.el-tab-pane),
:deep(.el-tabs__content) {
  height: 100%;
}
</style>
