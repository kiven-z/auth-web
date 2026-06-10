<script lang="ts" setup>
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
  <div>
    <div class="flex justify-center -mt-5 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <DeptTableView v-if="viewMode === 'table'" />
    <DeptTreeView v-else />
  </div>
</template>
