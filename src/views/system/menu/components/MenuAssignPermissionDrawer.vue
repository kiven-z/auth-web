<script lang="ts" setup>
import { getMenuPermissions } from '@/api/system/menu';
import type { SysPermissionPageRow } from '@/api/system/permission';
import { getPermissionPage } from '@/api/system/permission';
import AssignManagePanel, {
  createAssignCheckboxColumn,
  useAssignDrawer,
  type AssignCheckedApi,
} from '@/components/business/AssignManagePanel';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { transformI18n } from '@/plugins/i18n';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import type { FormInstance } from 'element-plus';
import { nextTick, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const panelRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);
const tableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);
const searchFormRef = ref<FormInstance>();
const { permissionDrawerDataColumns } = useMenuTableColumns();

const { loading, seed } = useAssignDrawer({
  loadSeed: async () => {
    const list = await getMenuPermissions(props.menuId);
    return list.map((row) => ({ key: row.permissionCode, label: row.permissionName }));
  },
});

const {
  tableData,
  loading: tableLoading,
  pagination,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
} = usePaginationState<SysPermissionPageRow>({
  searchForm: reactive({
    permissionName: undefined,
    permissionCode: undefined,
  }),
  defaultPageSize: 30,
  errorI18nKey: 'sysMenu.assignLoadFailed',
  fetchApi: (query) =>
    getPermissionPage({
      pageIndex: query.pageIndex as number,
      pageSize: query.pageSize as number,
      permissionName: query.permissionName as string | undefined,
      permissionCode: query.permissionCode as string | undefined,
      status: true,
      permissionType: 0,
    }),
});

function getRowLabel(row: Record<string, unknown>): string {
  return String(row.permissionName ?? '');
}

function buildTableColumns(assign: AssignCheckedApi): TableColumnList {
  return [
    createAssignCheckboxColumn(assign, 'permissionCode', { label: t('table.assigned') }),
    ...permissionDrawerDataColumns.value,
  ];
}

function handleRowDblclick(row: SysPermissionPageRow, assign: AssignCheckedApi) {
  assign.toggle(row as unknown as Record<string, unknown>);
}

function getSelectedKeys(): string[] {
  return panelRef.value?.getSelectedKeys() ?? [];
}

watch(loading, (isLoading) => {
  if (!isLoading) {
    void fetchTableData();
  }
});

watch(tableData, (rows) => {
  panelRef.value?.mergeLabels(rows as unknown as Record<string, unknown>[]);
  void nextTick(() => tableRef.value?.setAdaptive?.());
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <div v-loading="loading" class="flex min-h-0 w-full flex-1 flex-col">
    <AssignManagePanel
      v-if="!loading"
      ref="panelRef"
      :assigned-section-label="t('sysMenu.assignPermissionSectionLabel')"
      :get-row-label="getRowLabel"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :seed="seed"
      row-key="permissionCode"
    >
      <template #right="{ assign }">
        <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="mb-3 w-full overflow-auto">
          <el-form-item :label="t('sysMenu.permissionName')" prop="permissionName">
            <el-input
              v-model="searchForm.permissionName"
              :placeholder="t('sysMenu.assignPermissionSearch')"
              class="w-45!"
              clearable
            />
          </el-form-item>
          <el-form-item :label="t('sysMenu.permissionCode')" prop="permissionCode">
            <el-input v-model="searchForm.permissionCode" class="w-45!" clearable />
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" type="primary" @click="fetchTableData">
              {{ t('buttons.actionSearch') }}
            </el-button>
            <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
          </el-form-item>
        </el-form>

        <TableBar
          :columns="buildTableColumns(assign)"
          @fullscreen="tableRef?.setAdaptive?.()"
          @refresh="fetchTableData"
        >
          <template #default="{ size, dynamicColumns }">
            <AuthDataTable
              ref="tableRef"
              :adaptive-config="{ offsetBottom: 96 }"
              :columns="dynamicColumns"
              :data="tableData"
              :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
              :loading="tableLoading"
              :pagination="pagination"
              :size="size"
              adaptive
              align-whole="center"
              border
              highlight-current-row
              row-key="permissionCode"
              table-layout="auto"
              @page-current-change="handlePageCurrentChange"
              @page-size-change="handlePageSizeChange"
              @row-dblclick="(row) => handleRowDblclick(row, assign)"
            />
          </template>
        </TableBar>
      </template>
    </AssignManagePanel>
  </div>
</template>
