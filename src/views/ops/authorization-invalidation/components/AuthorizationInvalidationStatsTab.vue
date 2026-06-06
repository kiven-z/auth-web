<script lang="ts" setup>
import {
  type AuthorizationInvalidationSummary,
  getAuthorizationInvalidationSummary,
} from '@/api/ops/authorization-invalidation-summary';
import { errorMessage } from '@/ui/feedback/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationStatsTab',
});

const { t } = useI18n();

const loading = ref(false);
const summary = ref<AuthorizationInvalidationSummary | null>(null);

/**
 * 拉取统计摘要
 */
async function reload() {
  loading.value = true;
  try {
    summary.value = await getAuthorizationInvalidationSummary();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.statsLoadFailed' });
  } finally {
    loading.value = false;
  }
}

/**
 * 格式化失败率展示
 * @param value 失败率百分比
 * @returns 展示文本
 */
function formatFailureRate(value: number | string | undefined): string {
  if (value === undefined || value === null || value === '') {
    return '0.00%';
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) {
    return '0.00%';
  }
  return `${numeric.toFixed(2)}%`;
}

onMounted(() => {
  reload();
});
</script>

<template>
  <div v-loading="loading" class="px-4 pb-4">
    <div class="mb-3 flex justify-end">
      <el-button :loading="loading" type="primary" @click="reload">
        {{ t('authorizationInvalidation.statsRefresh') }}
      </el-button>
    </div>

    <el-card class="mb-4" shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsOutboxSection') }}</span>
      </template>
      <el-table :data="summary?.outbox ? [summary.outbox] : []" border stripe>
        <el-table-column :label="t('authorizationInvalidation.statsTotalCount')" min-width="100" prop="totalCount" />
        <el-table-column
          :label="t('authorizationInvalidation.outboxStatusEnum.PENDING')"
          min-width="100"
          prop="pendingCount"
        />
        <el-table-column
          :label="t('authorizationInvalidation.outboxStatusEnum.PROCESSING')"
          min-width="100"
          prop="processingCount"
        />
        <el-table-column
          :label="t('authorizationInvalidation.outboxStatusEnum.SUCCESS')"
          min-width="100"
          prop="successCount"
        />
        <el-table-column
          :label="t('authorizationInvalidation.outboxStatusEnum.FAILED')"
          min-width="100"
          prop="failedCount"
        />
        <el-table-column
          :label="t('authorizationInvalidation.outboxStatusEnum.DEAD')"
          min-width="100"
          prop="deadCount"
        />
        <el-table-column :label="t('authorizationInvalidation.statsFailureRate')" min-width="120">
          <template #default="{ row }">
            {{ formatFailureRate(row.failureRatePercent) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsEventSection') }}</span>
      </template>
      <el-table :data="summary?.event ? [summary.event] : []" border stripe>
        <el-table-column :label="t('authorizationInvalidation.statsTotalCount')" min-width="120" prop="totalCount" />
        <el-table-column
          :label="t('authorizationInvalidation.processingEnum.true')"
          min-width="120"
          prop="processingCount"
        />
        <el-table-column
          :label="t('authorizationInvalidation.processingEnum.false')"
          min-width="120"
          prop="completedCount"
        />
      </el-table>
    </el-card>
  </div>
</template>
