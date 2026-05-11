<script lang="tsx" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { ElCheckbox, ElInput, ElTag, ElTooltip } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AuthAssignFetchAll, AuthAssignFetchPage, AuthAssignMode, AuthAssignSeedItem } from './types';
import { useAssignState } from './useAssignState';
import './index.scss';

defineOptions({ name: 'AuthAssignManage' });

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
    candidateTableMaxHeight?: string | number;
    // 左侧卡片 el-col 的 span 值，默认 6
    leftSpan?: number;
    getRowLabel?: (row: Record<string, unknown>) => string;
  }>(),
  {
    leftTitle: '',
    assignedSectionLabel: '',
    initialPageSize: 30,
    candidateTableMaxHeight: '55vh',
    leftSpan: 6,
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

// 确保 max-height 为有效的 CSS 值
const maxHeight = computed(() => {
  const v = props.candidateTableMaxHeight;
  return typeof v === 'number' ? `${v}px` : v;
});

// 在 table 列头自动追加 checkbox 列
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
  <el-row :gutter="12" class="auth-assign-manage">
    <!-- 左侧：已分配区域 -->
    <el-col :span="leftSpan" class="auth-assign-manage__col">
      <el-card class="auth-assign-manage__card" shadow="never">
        <template #header>
          <div class="auth-assign-manage__card-header">
            <el-text size="large" tag="b">{{ leftTitle }}</el-text>
            <el-text v-if="leftSubtitle" class="auth-assign-manage__subtitle" size="small" type="info">
              {{ leftSubtitle }}
            </el-text>
          </div>
        </template>

        <el-text class="auth-assign-manage__section-label" size="small" type="info">
          {{ assignedSectionLabel || t('sysMenu.assigned') }}
        </el-text>

        <div class="auth-assign-manage__tags">
          <template v-if="assignedTags.length">
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span class="auth-assign-manage__tag-label">{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
          </template>
          <el-text v-else size="small" type="info">
            {{ t('sysMenu.assignEmptySelected') }}
          </el-text>
        </div>
      </el-card>
    </el-col>

    <!-- 右侧：候选列表 -->
    <el-col :span="24 - leftSpan" class="auth-assign-manage__col">
      <el-input v-model="keyword" :placeholder="searchPlaceholder" class="auth-assign-manage__search" clearable />
      <div :style="{ maxHeight: maxHeight }" class="auth-assign-manage__table-wrap">
        <AuthDataTable
          :columns="columnsWithCheckbox"
          :data="tableRows"
          :loading="tableLoading"
          :pagination="mode === 'page' ? pagination : null"
          :row-key="rowKey"
          border
          @page-current-change="handlePageCurrentChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </el-col>
  </el-row>
</template>
