<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import type { AuthDataTableAdaptiveConfig } from '@/components/ui/AuthDataTable/src/types';
import TableBar from '@/components/ui/TableBar';
import { computed, ref, useAttrs } from 'vue';
import type { PaginationTableState } from './usePaginationState';

import { AUTH_PAGED_TABLE_HEADER_CELL_STYLE } from './constants';
import type { AuthPagedTableExpose } from './types';

defineOptions({
  name: 'AuthPagedTable',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    state: PaginationTableState;
    columns: TableColumnList;
    title?: string;
    rowKey?: string | ((row: unknown) => string);
    adaptive?: boolean;
    adaptiveConfig?: AuthDataTableAdaptiveConfig;
    border?: boolean;
    highlightCurrentRow?: boolean;
    alignWhole?: 'left' | 'center' | 'right';
    tableLayout?: 'fixed' | 'auto';
    showOverflowTooltip?: boolean;
  }>(),
  {
    title: '',
    rowKey: 'id',
    adaptive: true,
    border: true,
    highlightCurrentRow: true,
    alignWhole: 'center',
    tableLayout: 'auto',
    showOverflowTooltip: false,
  }
);

const emit = defineEmits<{
  'selection-change': [rows: unknown[]];
}>();

const attrs = useAttrs();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const tableData = computed(() => props.state.tableData.value);
const loading = computed(() => props.state.loading.value);

/**
 * 工具栏刷新：委托给分页状态重新拉取。
 */
function handleRefresh() {
  void props.state.fetchTableData();
}

/**
 * 全屏切换后重算表格高度。
 */
function handleFullscreen() {
  void tableRef.value?.setAdaptive();
}

/**
 * 多选变化：同步 selectedRows，并向外透传。
 * @param rows 当前选中行
 */
function handleSelectionChange(rows: unknown[]) {
  props.state.handleSelectionChange(rows);
  emit('selection-change', rows);
}

defineExpose<AuthPagedTableExpose>({
  setAdaptive: () => tableRef.value?.setAdaptive() ?? Promise.resolve(),
  fetchTableData: () => props.state.fetchTableData(),
});
</script>

<template>
  <TableBar
    :columns="columns"
    :refresh-loading="loading"
    :title="title"
    @fullscreen="handleFullscreen"
    @refresh="handleRefresh"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>

    <template v-if="$slots.buttons" #buttons>
      <slot name="buttons" />
    </template>

    <template #default="{ size, dynamicColumns }">
      <AuthDataTable
        ref="tableRef"
        :adaptive="adaptive"
        :adaptive-config="adaptiveConfig"
        :align-whole="alignWhole"
        :border="border"
        :columns="dynamicColumns"
        :data="tableData"
        :header-cell-style="AUTH_PAGED_TABLE_HEADER_CELL_STYLE"
        :highlight-current-row="highlightCurrentRow"
        :loading="loading"
        :pagination="state.pagination"
        :row-key="rowKey"
        :show-overflow-tooltip="showOverflowTooltip"
        :size="size"
        :table-layout="tableLayout"
        v-bind="attrs"
        @page-current-change="state.handlePageCurrentChange"
        @page-size-change="state.handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template v-if="$slots.actions" #actions="slotProps">
          <div class="flex items-center justify-center">
            <slot name="actions" v-bind="slotProps" />
          </div>
        </template>

        <template v-if="$slots.append" #append>
          <slot name="append" />
        </template>

        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </AuthDataTable>
    </template>
  </TableBar>
</template>
