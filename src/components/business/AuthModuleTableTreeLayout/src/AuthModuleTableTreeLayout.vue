<script lang="ts" setup>
defineOptions({
  name: 'AuthModuleTableTreeLayout',
});

defineProps<{
  options: { label: string; value: string }[];
}>();

const viewMode = defineModel<string>({ required: true });
</script>

<template>
  <div>
    <div class="auth-module-table-tree-layout__segmented flex justify-center mt-[-20px] pb-1">
      <el-segmented v-model="viewMode" :options="options" />
    </div>

    <slot v-if="viewMode === 'table'" name="table" />
    <slot v-else name="tree" />
  </div>
</template>
