<script lang="ts" setup>
import {
  type AuthorizationInvalidationFailureRateTrend,
  type AuthorizationInvalidationFailureRateTrendGranularity,
  getAuthorizationInvalidationFailureRateTrend,
} from '@/api/ops/authorization-invalidation-stats-trend';
import {
  type AuthorizationInvalidationSummary,
  getAuthorizationInvalidationSummary,
} from '@/api/ops/authorization-invalidation-summary';
import echarts from '@/plugins/echarts';
import { errorMessage } from '@/ui/feedback/message';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/views/ops/authorization-invalidation/constants/permissions';
import useAuthorizationInvalidationStatsTableColumns from '@/views/ops/authorization-invalidation/hooks/columns/useAuthorizationInvalidationStatsTableColumns';
import type { EChartsOption } from 'echarts';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthorizationInvalidationStatsTab',
});

const { t } = useI18n();
const { outboxColumns, eventColumns } = useAuthorizationInvalidationStatsTableColumns();

const loading = ref(false);
const trendLoading = ref(false);
const summary = ref<AuthorizationInvalidationSummary | null>(null);
const trend = ref<AuthorizationInvalidationFailureRateTrend | null>(null);
const granularity = ref<AuthorizationInvalidationFailureRateTrendGranularity>('DAY');
const trendDays = ref(30);

const chartRef = ref<HTMLDivElement>();
let chartInstance: echarts.ECharts | null = null;

const outboxRows = computed(() => (summary.value?.outbox ? [summary.value.outbox] : []));
const eventRows = computed(() => (summary.value?.event ? [summary.value.event] : []));

/**
 * 解析失败率数值
 * @param value 失败率
 * @returns 数值
 */
function parseFailureRate(value: number | string | undefined): number {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(numeric) ? 0 : numeric;
}

/**
 * 构建折线图配置
 * @returns ECharts 配置
 */
function buildChartOption(): EChartsOption {
  const points = trend.value?.points ?? [];
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const item = Array.isArray(params) ? params[0] : params;
        const index = typeof item?.dataIndex === 'number' ? item.dataIndex : -1;
        const point = index >= 0 ? points[index] : undefined;
        if (!point) {
          return '';
        }
        const rate = parseFailureRate(point.failureRatePercent).toFixed(2);
        return [
          point.bucket ?? '',
          `${t('authorizationInvalidation.statsTrendTooltipFailureRate')}: ${rate}%`,
          `${t('authorizationInvalidation.statsTrendTooltipTotal')}: ${point.totalCount ?? 0}`,
          `${t('authorizationInvalidation.statsTrendTooltipFailed')}: ${point.failedCount ?? 0}`,
          `${t('authorizationInvalidation.statsTrendTooltipDead')}: ${point.deadCount ?? 0}`,
        ].join('<br/>');
      },
    },
    grid: {
      left: 48,
      right: 24,
      top: 24,
      bottom: 48,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: points.map((point) => point.bucket ?? ''),
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      name: t('authorizationInvalidation.statsTrendYAxis'),
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: points.length <= 31,
        data: points.map((point) => parseFailureRate(point.failureRatePercent)),
      },
    ],
  };
}

/**
 * 渲染折线图
 */
function renderChart() {
  if (!chartRef.value) {
    return;
  }
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }
  chartInstance.setOption(buildChartOption(), true);
}

/**
 * 窗口尺寸变化时重绘图表
 */
function handleResize() {
  chartInstance?.resize();
}

/**
 * 拉取统计摘要
 */
async function reloadSummary() {
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
 * 拉取失败率趋势
 */
async function reloadTrend() {
  trendLoading.value = true;
  try {
    trend.value = await getAuthorizationInvalidationFailureRateTrend({
      granularity: granularity.value,
      days: trendDays.value,
    });
    renderChart();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'authorizationInvalidation.statsTrendLoadFailed' });
  } finally {
    trendLoading.value = false;
  }
}

/**
 * 刷新摘要与趋势
 */
async function reload() {
  await Promise.all([reloadSummary(), reloadTrend()]);
}

watch([granularity, trendDays], () => {
  reloadTrend();
});

onMounted(() => {
  reload();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <div class="px-4 pb-4">
    <div class="mb-3 flex justify-end">
      <el-button
        v-perms="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY"
        :loading="loading || trendLoading"
        type="primary"
        @click="reload"
      >
        {{ t('authorizationInvalidation.statsRefresh') }}
      </el-button>
    </div>

    <el-card v-loading="trendLoading" class="mb-4" shadow="never">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span>{{ t('authorizationInvalidation.statsTrendSection') }}</span>
          <div class="flex flex-wrap items-center gap-3">
            <el-radio-group v-model="granularity" size="small">
              <el-radio-button value="DAY">
                {{ t('authorizationInvalidation.statsTrendGranularityDay') }}
              </el-radio-button>
              <el-radio-button value="WEEK">
                {{ t('authorizationInvalidation.statsTrendGranularityWeek') }}
              </el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="trendDays" size="small">
              <el-radio-button :value="7">{{ t('authorizationInvalidation.statsTrendRange7Days') }}</el-radio-button>
              <el-radio-button :value="30">{{ t('authorizationInvalidation.statsTrendRange30Days') }}</el-radio-button>
              <el-radio-button :value="90">{{ t('authorizationInvalidation.statsTrendRange90Days') }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      <div ref="chartRef" class="h-80 w-full" />
    </el-card>

    <el-card class="mb-4" shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsOutboxSection') }}</span>
      </template>
      <AuthDataTable :columns="outboxColumns" :data="outboxRows" :loading="loading" border stripe />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>{{ t('authorizationInvalidation.statsEventSection') }}</span>
      </template>
      <AuthDataTable :columns="eventColumns" :data="eventRows" :loading="loading" border stripe />
    </el-card>
  </div>
</template>
