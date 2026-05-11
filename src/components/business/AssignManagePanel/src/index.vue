<script lang="tsx" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { Search } from '@element-plus/icons-vue';
import { useDebounceFn, useResizeObserver } from '@vueuse/core';
import { ElCheckbox, ElInput, ElTag, ElTooltip } from 'element-plus';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AuthAssignFetchAll, AuthAssignFetchPage, AuthAssignMode, AuthAssignSeedItem } from './types';
import { useAssignState } from './useAssignState';

defineOptions({ name: 'AuthAssignManage' });

/** 抽屉内表格距视口底部的留白（含底栏、分页与内边距），略大于默认以便分页始终落在可视区内 */
const ADAPTIVE_OFFSET_BOTTOM = 128;

const props = withDefaults(
  defineProps<{
    mode: AuthAssignMode;
    leftTitle?: string;
    leftSubtitle?: string;
    assignedSectionLabel?: string;
    searchPlaceholder?: string;
    columns: TableColumnList;
    rowKey: string;
    loading?: boolean;
    saving?: boolean;
    assignedSeed?: AuthAssignSeedItem[];
    fetchPage?: AuthAssignFetchPage;
    fetchAllRows?: AuthAssignFetchAll;
    initialPageSize?: number;
    /** 左侧卡片 el-col 的 span 值，默认 7 */
    leftSpan?: number;
    getRowLabel?: (row: Record<string, unknown>) => string;
  }>(),
  {
    leftTitle: '',
    assignedSectionLabel: '',
    initialPageSize: 30,
    leftSpan: 7,
  }
);

const { t } = useI18n();

const {
  keyword,
  internalLoading,
  tableRows,
  pagination,
  assignedTags,
  isRowSelected,
  nonRemovableKeys,
  toggleRow,
  onTagClose,
  handlePageSizeChange,
  handlePageCurrentChange,
  getSelectedKeys,
} = useAssignState({
  mode: props.mode,
  rowKey: props.rowKey,
  fetchPage: props.fetchPage,
  fetchAllRows: props.fetchAllRows,
  seed: props.assignedSeed,
  getRowLabel: props.getRowLabel,
  initialPageSize: props.initialPageSize,
});

const tableLoading = computed(() => props.loading || internalLoading.value);

const rootRef = ref<HTMLElement | null>(null);
const dataTableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);

/** 分阶段延迟重算用的定时器，卸载时清理 */
const relayoutStaggerIds: number[] = [];

/**
 * 通知表格按当前容器重新计算自适应高度。
 * 抽屉打开瞬间 DOM 位置可能仍在过渡中，需多帧后再读 getBoundingClientRect。
 */
async function relayoutTable() {
  await nextTick();
  await dataTableRef.value?.setAdaptive?.();
}

const debouncedRelayout = useDebounceFn(() => void relayoutTable(), 100);

/**
 * 立即 + rAF + 多次延迟重算，覆盖抽屉动画与首屏数据渲染完成后的布局。
 */
function scheduleAdaptiveRelayout() {
  for (const id of relayoutStaggerIds) {
    window.clearTimeout(id);
  }
  relayoutStaggerIds.length = 0;

  void relayoutTable();

  requestAnimationFrame(() => {
    void relayoutTable();
    requestAnimationFrame(() => {
      void relayoutTable();
    });
  });

  for (const ms of [80, 200, 380, 560]) {
    relayoutStaggerIds.push(
      window.setTimeout(() => {
        void relayoutTable();
      }, ms)
    );
  }
}

useResizeObserver(rootRef, () => {
  debouncedRelayout();
});

onMounted(() => {
  scheduleAdaptiveRelayout();
});

onBeforeUnmount(() => {
  for (const id of relayoutStaggerIds) {
    window.clearTimeout(id);
  }
  relayoutStaggerIds.length = 0;
});

/** 数据加载结束后表格区域高度才稳定，必须再算一次 */
watch(tableLoading, (loading) => {
  if (!loading) {
    scheduleAdaptiveRelayout();
  }
});

watch([() => assignedTags.value.length, () => tableRows.value.length, pagination], () => debouncedRelayout(), {
  deep: true,
});

const columnsWithCheckbox = computed<TableColumnList>(() => [
  {
    label: t('sysMenu.assigned'),
    prop: '__assign',
    align: 'center',
    width: 80,
    formatter: (row: Record<string, unknown>) => {
      const key = row[props.rowKey];
      const disabled = props.saving || nonRemovableKeys.value.has(key as string);
      return <ElCheckbox model-value={isRowSelected(row)} disabled={disabled} onChange={() => toggleRow(row)} />;
    },
  },
  ...props.columns,
]);

defineExpose({ getSelectedKeys });
</script>

<template>
  <div ref="rootRef" class="assign-manage-panel">
    <el-row :gutter="16" class="assign-manage-panel__row">
      <el-col :span="leftSpan" class="assign-manage-panel__col assign-manage-panel__col--left">
        <el-card class="assign-manage-panel__card" shadow="never">
          <template #header>
            <div class="assign-manage-panel__context">
              <div v-if="leftTitle" class="assign-manage-panel__context-title">
                {{ leftTitle }}
              </div>
              <div v-if="leftSubtitle" class="assign-manage-panel__context-sub">
                {{ leftSubtitle }}
              </div>
            </div>
          </template>

          <div class="assign-manage-panel__section-label">
            {{ assignedSectionLabel || t('sysMenu.assigned') }}
          </div>

          <div v-if="assignedTags.length" class="assign-manage-panel__tags">
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              class="assign-manage-panel__tag"
              effect="light"
              round
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" :show-after="400" placement="top">
                <span class="assign-manage-panel__tag-text">{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
          </div>
          <div v-else class="assign-manage-panel__tags assign-manage-panel__tags-empty">
            <el-text size="small" type="info">
              {{ t('sysMenu.assignEmptySelected') }}
            </el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24 - leftSpan" class="assign-manage-panel__col assign-manage-panel__col--right">
        <div class="assign-manage-panel__search">
          <el-input
            v-model="keyword"
            :placeholder="searchPlaceholder"
            :prefix-icon="Search"
            class="assign-manage-panel__search-input"
            clearable
          />
        </div>
        <div class="assign-manage-panel__table-host">
          <AuthDataTable
            ref="dataTableRef"
            :adaptive-config="{ offsetBottom: ADAPTIVE_OFFSET_BOTTOM, paginationReserve: 72 }"
            :columns="columnsWithCheckbox"
            :data="tableRows"
            :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
            :loading="tableLoading"
            :pagination="mode === 'page' ? pagination : null"
            :row-key="rowKey"
            adaptive
            align-whole="center"
            border
            highlight-current-row
            table-layout="auto"
            @page-current-change="handlePageCurrentChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
