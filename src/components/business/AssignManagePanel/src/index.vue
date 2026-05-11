<script lang="tsx" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { Search } from '@element-plus/icons-vue';
import { useDebounceFn, useResizeObserver } from '@vueuse/core';
import { ElCheckbox, ElInput, ElTag, ElTooltip } from 'element-plus';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AuthAssignFetchPage, AuthAssignSeedItem } from './types';
import { useAssignPage } from './useAssignPage';

defineOptions({ name: 'AuthAssignManage' });

/** 抽屉内表格距视口底部的留白（含底栏、分页与内边距），略大于默认以便分页始终落在可视区内 */
const ADAPTIVE_OFFSET_BOTTOM = 128;

const props = withDefaults(
  defineProps<{
    leftTitle?: string;
    leftSubtitle?: string;
    assignedSectionLabel?: string;
    searchPlaceholder?: string;
    columns: TableColumnList;
    rowKey: string;
    loading?: boolean;
    saving?: boolean;
    assignedSeed?: AuthAssignSeedItem[];
    fetchPage: AuthAssignFetchPage;
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
  clearRemovableSelection,
  handlePageSizeChange,
  handlePageCurrentChange,
  getSelectedKeys,
} = useAssignPage({
  rowKey: props.rowKey,
  fetchPage: props.fetchPage,
  seed: props.assignedSeed,
  getRowLabel: props.getRowLabel,
  initialPageSize: props.initialPageSize,
});

const tableLoading = computed(() => props.loading || internalLoading.value);

const rootRef = ref<HTMLElement | null>(null);
const dataTableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);

/**
 * 通知表格按当前容器重新计算自适应高度。
 * 抽屉打开瞬间 DOM 位置可能仍在过渡中，延迟后再读 getBoundingClientRect。
 */
async function relayoutTable() {
  await nextTick();
  await dataTableRef.value?.setAdaptive?.();
}

const debouncedRelayout = useDebounceFn(() => void relayoutTable(), 100);

useResizeObserver(rootRef, () => {
  debouncedRelayout();
});

onMounted(() => {
  void relayoutTable();
  requestAnimationFrame(() => void relayoutTable());
});

/** 数据加载 / 已选标签变化后表格高度可能变化，触发自适应 */
watch(tableLoading, (loading) => {
  if (!loading) {
    requestAnimationFrame(() => void relayoutTable());
  }
});

watch([() => assignedTags.value.length, () => tableRows.value.length, pagination], () => debouncedRelayout(), {
  deep: true,
});

/** 是否存在可一键清空的已选项（不含种子锁定项） */
const hasRemovableSelection = computed(() => assignedTags.value.some((tag) => tag.closable));

/**
 * 表格行双击：与勾选列行为一致，切换选中（种子锁定行不可取消）。
 * @param row 当前行
 */
function onTableRowDblclick(row: Record<string, unknown>) {
  if (props.saving) return;
  toggleRow(row);
}

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
    <el-row :gutter="16">
      <el-col :span="leftSpan">
        <el-card shadow="never">
          <template #header>
            <div>
              <div v-if="leftTitle" class="font-semibold">
                {{ leftTitle }}
              </div>
              <div v-if="leftSubtitle" class="text-[13px] text-[var(--el-text-color-secondary)]">
                {{ leftSubtitle }}
              </div>
            </div>
          </template>

          <div class="flex justify-between">
            <div class="text-xs font-semibold text-[var(--el-text-color-secondary)]">
              {{ assignedSectionLabel || t('sysMenu.assigned') }}
            </div>
            <el-button :disabled="saving || !hasRemovableSelection" link type="danger" @click="clearRemovableSelection">
              {{ t('sysMenu.assignClearAll') }}
            </el-button>
          </div>

          <div v-if="assignedTags.length" class="assign-manage-panel__tags">
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="light"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" :show-after="400" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
          </div>
          <div v-else class="assign-manage-panel__tags flex items-center justify-center">
            <el-text type="info">
              {{ t('sysMenu.assignEmptySelected') }}
            </el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24 - leftSpan">
        <div class="shrink-0 mb-3">
          <el-input v-model="keyword" :placeholder="searchPlaceholder" :prefix-icon="Search" clearable />
        </div>
        <div>
          <AuthDataTable
            ref="dataTableRef"
            :adaptive-config="{ offsetBottom: ADAPTIVE_OFFSET_BOTTOM, paginationReserve: 72 }"
            :columns="columnsWithCheckbox"
            :data="tableRows"
            :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
            :loading="tableLoading"
            :pagination="pagination"
            :row-key="rowKey"
            adaptive
            align-whole="center"
            border
            highlight-current-row
            table-layout="auto"
            @page-current-change="handlePageCurrentChange"
            @page-size-change="handlePageSizeChange"
            @row-dblclick="onTableRowDblclick"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
