<script lang="ts" setup>
import AuthModuleTableTreeLayout from '@/components/business/AuthModuleTableTreeLayout';
import DeptTableView from '@/views/system/dept/components/DeptTableView.vue';
import DeptTreeView from '@/views/system/dept/components/DeptTreeView.vue';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemDept',
});

const { t } = useI18n();

const segmentedOptions = computed(() => [
  { label: t('dept.viewTableTitle'), value: 'table' as const },
  { label: t('dept.viewTreeTitle'), value: 'tree' as const },
]);

const { viewMode } = useDeptPageState();
</script>

<template>
  <AuthModuleTableTreeLayout v-model="viewMode" :options="segmentedOptions">
    <template #table>
      <DeptTableView />
    </template>
    <template #tree>
      <DeptTreeView />
    </template>
  </AuthModuleTableTreeLayout>
</template>
