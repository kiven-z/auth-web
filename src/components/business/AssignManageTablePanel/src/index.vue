<script lang="tsx" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { Search } from '@element-plus/icons-vue';
import { useDebounceFn } from '@vueuse/core';
import { ElCheckbox, ElTag, ElTooltip } from 'element-plus';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePaginationState } from '@/shared/hooks/usePaginationState';

import type { AssignFetchPage, AssignGetRowLabel, AssignSeedItem } from './types';
import { useAssignChecked } from './useAssignChecked';

defineOptions({ name: 'AssignManageTablePanel' });

const props = withDefaults(
  defineProps<{
    leftTitle?: string;
    leftSubtitle?: string;
    assignedSectionLabel?: string;
    searchPlaceholder?: string;
    columns: TableColumnList;
    rowKey: string;
    saving?: boolean;
    seed?: AssignSeedItem[];
    fetchPage: AssignFetchPage;
    initialPageSize?: number;
    leftSpan?: number;
    getRowLabel: AssignGetRowLabel;
    errorI18nKey?: string;
  }>(),
  {
    leftTitle: '',
    leftSubtitle: '',
    assignedSectionLabel: '',
    searchPlaceholder: '',
    seed: () => [],
    initialPageSize: 30,
    leftSpan: 7,
    errorI18nKey: 'sysMenu.assignLoadFailed',
  }
);

const { t } = useI18n();
const dataTableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);
const searchForm = reactive({ keyword: '' });

const { loading, tableData, pagination, fetchTableData, handlePageSizeChange, handlePageCurrentChange } =
  usePaginationState<Record<string, unknown>>({
    searchForm,
    errorI18nKey: props.errorI18nKey,
    defaultPageSize: props.initialPageSize,
    fetchApi: async (query) => {
      const page = await props.fetchPage({
        pageIndex: query.pageIndex as number,
        pageSize: query.pageSize as number,
        keyword: query.keyword as string,
      });
      return {
        ...page,
        list: (page.list ?? []) as Record<string, unknown>[],
      };
    },
  });

const {
  assignedTags,
  canClearRemovable,
  applySeed,
  mergeLabels,
  isLocked,
  isSelected,
  toggle,
  removeKey,
  clearRemovable,
  getSelectedKeys,
} = useAssignChecked({
  rowKey: props.rowKey,
  getRowLabel: props.getRowLabel,
});

/**
 * 同步表格布局
 */
function syncTableLayout() {
  void nextTick(() => dataTableRef.value?.setAdaptive?.());
}

watch(
  () => props.seed,
  (seed) => {
    applySeed(seed);
    void fetchTableData();
  },
  { immediate: true, deep: true }
);

watch(tableData, (rows) => {
  mergeLabels(rows);
  syncTableLayout();
});

onMounted(syncTableLayout);

/**
 * 处理关键词搜索事件
 */
const debouncedSearch = useDebounceFn(() => {
  pagination.currentPage = 1;
  void fetchTableData();
}, 300);

/**
 * 处理关键词清空事件
 */
function handleKeywordClear() {
  searchForm.keyword = undefined;
  pagination.currentPage = 1;
  void fetchTableData();
}

/**
 * 处理行双击事件
 * @param row 行数据
 */
function handleTableRowDblclick(row: Record<string, unknown>) {
  if (props.saving) {
    return;
  }
  toggle(row);
}

/**
 * 计算包含复选框的列
 * @returns 包含复选框的列
 */
const columnsWithCheckbox = computed<TableColumnList>(() => [
  {
    label: t('sysMenu.assigned'),
    prop: '__assign',
    align: 'center',
    width: 80,
    formatter: (row: Record<string, unknown>) => {
      const key = String(row[props.rowKey] ?? '');
      const disabled = props.saving || isLocked(key);
      return <ElCheckbox model-value={isSelected(row)} disabled={disabled} onChange={() => toggle(row)} />;
    },
  },
  ...props.columns,
]);

defineExpose({
  getSelectedKeys,
  reload: fetchTableData,
});
</script>

<template>
  <div class="assign-manage-table-panel">
    <el-row :gutter="16">
      <el-col :span="leftSpan">
        <el-card shadow="never">
          <template #header>
            <div>
              <div v-if="leftTitle" class="font-semibold">
                {{ leftTitle }}
              </div>
              <div v-if="leftSubtitle" class="text-[13px] text-(--el-text-color-secondary)">
                {{ leftSubtitle }}
              </div>
            </div>
          </template>

          <div class="flex justify-between">
            <div v-if="assignedSectionLabel" class="text-xs font-semibold text-(--el-text-color-secondary)">
              {{ assignedSectionLabel }}
            </div>
            <!-- 全部清空 -->
            <el-button :disabled="saving || !canClearRemovable" link type="danger" @click="clearRemovable">
              {{ t('sysMenu.assignClearAll') }}
            </el-button>
          </div>

          <div v-if="assignedTags.length" class="assign-manage-table-panel__tags">
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="!isLocked(tag.key) && !saving"
              effect="light"
              type="success"
              @close="removeKey(tag.key)"
            >
              <el-tooltip :content="tag.key" :show-after="400" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
          </div>
          <div v-else class="assign-manage-table-panel__tags flex items-center justify-center">
            <el-text type="info">
              {{ t('sysMenu.assignEmptySelected') }}
            </el-text>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24 - leftSpan">
        <div class="mb-3 shrink-0">
          <slot
            :keyword="searchForm.keyword"
            :reload="fetchTableData"
            :set-keyword="(value: string) => (searchForm.keyword = value)"
            name="search"
          >
            <el-input
              v-model="searchForm.keyword"
              :placeholder="searchPlaceholder"
              :prefix-icon="Search"
              clearable
              @clear="handleKeywordClear"
              @input="debouncedSearch"
            />
          </slot>
        </div>

        <AuthDataTable
          ref="dataTableRef"
          :adaptive-config="{ offsetBottom: 96 }"
          :columns="columnsWithCheckbox"
          :data="tableData"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          table-layout="auto"
          @page-current-change="handlePageCurrentChange"
          @page-size-change="handlePageSizeChange"
          @row-dblclick="handleTableRowDblclick"
        />
      </el-col>
    </el-row>
  </div>
</template>
