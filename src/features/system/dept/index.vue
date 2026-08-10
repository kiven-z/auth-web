<script lang="ts" setup>
import DeptTableView from '@/features/system/dept/components/DeptTableView.vue';
import DeptTreeView from '@/features/system/dept/components/DeptTreeView.vue';
import useDeptPageState from '@/features/system/dept/hooks/useDeptPageState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemDept',
});

const { t } = useI18n();

const segmentedOptions = computed(() => [
  { label: t('dept.page.view.table'), value: 'table' as const },
  { label: t('dept.page.view.tree'), value: 'tree' as const },
]);

const { viewMode } = useDeptPageState();
</script>

<template>
  <div>
    <div class="flex justify-center -mt-5 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <DeptTableView v-if="viewMode === 'table'" />
    <DeptTreeView v-else />
  </div>
</template>
