<script lang="tsx" setup>
import type { DeptClosureHealth } from '@/api/system/dept';
import { getDeptClosureHealth } from '@/api/system/dept';
import Description from '@/components/ui/Description';
import { errorMessage } from '@/shared/messaging/message';
import { ElAlert, ElDivider } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useDeptClosureHealthColumns from '@/views/system/dept/hooks/useDeptClosureHealthColumns';

defineOptions({
  name: 'DeptClosureHealthDialog',
});

const { t } = useI18n();

const loading = ref(false);
const data = ref<DeptClosureHealth | null>(null);

const { summaryColumns, healthStatsColumns, parentLinkColumns, depthChainColumns } = useDeptClosureHealthColumns();

/**
 * 拉取闭包健康检查结果
 */
async function reload() {
  loading.value = true;
  try {
    data.value = await getDeptClosureHealth();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'dept.closureHealthLoadFailed' });
  } finally {
    loading.value = false;
  }
}

const summaryData = computed(() => {
  const health = data.value;
  if (!health) {
    return [];
  }
  return [
    {
      passed: health.passed,
      checkedAt: health.checkedAt,
      missingParentLinkCount: health.missingParentLinkCount,
      depthChainAnomalyCount: health.depthChainAnomalyCount,
      parentLinkSampleTruncated: health.parentLinkSampleTruncated,
      depthChainSampleTruncated: health.depthChainSampleTruncated,
    },
  ];
});

const healthStatsData = computed(() => {
  const stats = data.value?.healthStats;
  if (!stats) {
    return [];
  }
  return [stats];
});

const alertType = computed(() => {
  if (!data.value) {
    return 'info' as const;
  }
  return data.value.passed ? ('success' as const) : ('error' as const);
});

const alertTitle = computed(() => {
  if (!data.value) {
    return '';
  }
  return data.value.passed ? t('dept.closureHealthAlertPass') : t('dept.closureHealthAlertFail');
});

defineExpose({ reload });

onMounted(() => {
  void reload();
});
</script>

<template>
  <div v-loading="loading" class="min-h-40">
    <el-alert v-if="data" :closable="false" :title="alertTitle" :type="alertType" class="mb-4" show-icon />

    <template v-if="data">
      <Description :column="2" :columns="summaryColumns" :data="summaryData" :title="t('dept.closureHealthSummary')" />

      <el-divider />

      <Description
        :column="2"
        :columns="healthStatsColumns"
        :data="healthStatsData"
        :title="t('dept.closureHealthStatsTitle')"
      />

      <el-divider />

      <Description
        :column="2"
        :columns="parentLinkColumns"
        :data="data.parentLinkAnomalies"
        :title="t('dept.closureHealthParentLinkTitle')"
      />
      <p v-if="data.parentLinkAnomalies.length === 0" class="text-sm text-(--el-text-color-secondary) mb-4">
        {{ t('dept.closureHealthAnomalyEmpty') }}
      </p>

      <el-divider />

      <Description
        :column="2"
        :columns="depthChainColumns"
        :data="data.depthChainAnomalies"
        :title="t('dept.closureHealthDepthChainTitle')"
      />
      <p v-if="data.depthChainAnomalies.length === 0" class="text-sm text-(--el-text-color-secondary)">
        {{ t('dept.closureHealthAnomalyEmpty') }}
      </p>
    </template>
  </div>
</template>
