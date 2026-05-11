<script lang="tsx" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { ElCheckbox, ElInput, ElTag, ElTooltip } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AuthAssignFetchAll, AuthAssignFetchPage, AuthAssignMode, AuthAssignSeedItem } from './types';
import { useAssignState } from './useAssignState';

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
  <el-row :gutter="12">
    <!-- 左侧：已分配区域 -->
    <el-col :span="leftSpan">
      <el-card shadow="never">
        <template #header>
          <div>
            <el-text size="large" tag="b">{{ leftTitle }}</el-text>
            <el-text v-if="leftSubtitle" type="info">
              {{ leftSubtitle }}
            </el-text>
          </div>
        </template>

        <el-text size="small" type="info">
          {{ assignedSectionLabel || t('sysMenu.assigned') }}
        </el-text>

        <div>
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
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>

            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
              </el-tooltip>
            </el-tag>
            <el-tag
              v-for="tag in assignedTags"
              :key="tag.key"
              :closable="tag.closable && !saving"
              effect="plain"
              type="success"
              @close="onTagClose(tag.key)"
            >
              <el-tooltip :content="tag.key" placement="top">
                <span>{{ tag.label }}</span>
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
    <el-col :span="24 - leftSpan">
      <el-input v-model="keyword" :placeholder="searchPlaceholder" clearable />
      <AuthDataTable
        ref="tableRef"
        :adaptive-config="{ offsetBottom: 96 }"
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
    </el-col>
  </el-row>
</template>
