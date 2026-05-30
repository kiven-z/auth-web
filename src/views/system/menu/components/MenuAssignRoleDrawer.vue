<script lang="ts" setup>
import { getMenuRoles } from '@/api/system/menu';
import type { SysRolePageRow } from '@/api/system/role';
import { getRolePage } from '@/api/system/role';
import AssignManagePanel, {
  type AssignCheckedApi,
  createAssignCheckboxColumn,
  useAssignDrawer,
} from '@/components/business/AssignManagePanel';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { transformI18n } from '@/plugins/i18n';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import type { FormInstance } from 'element-plus';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const panelRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);
const tableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);
const searchFormRef = ref<FormInstance>();
const { roleDrawerDataColumns } = useMenuTableColumns();

const { loading, seed } = useAssignDrawer({
  loadSeed: async () => {
    const list = await getMenuRoles(props.menuId);
    return list.map((row) => ({ key: row.roleCode, label: row.roleName }));
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
} = usePaginationState<SysRolePageRow>({
  searchForm: reactive({
    roleName: undefined,
    roleCode: undefined,
  }),
  defaultPageSize: 30,
  errorI18nKey: 'sysMenu.assignLoadFailed',
  fetchApi: (query) =>
    getRolePage({
      pageIndex: query.pageIndex as number,
      pageSize: query.pageSize as number,
      roleName: query.roleName as undefined,
      roleCode: query.roleCode as undefined,
      status: true,
      roleType: 2,
    }),
});

function getRowLabel(row: Record<string, unknown>): string {
  return String(row.roleName ?? '');
}

function buildTableColumns(assign: AssignCheckedApi): TableColumnList {
  return [
    createAssignCheckboxColumn(assign, 'roleCode', { label: t('table.assigned') }),
    {
      label: t('sysMenu.roleCode'),
      prop: 'roleCode',
    },
    {
      label: t('sysMenu.roleName'),
      prop: 'roleName',
    },
  ];
}

function getSelectedKeys(): string[] {
  return panelRef.value?.getSelectedKeys() ?? [];
}

watch(loading, (isLoading) => {
  if (!isLoading) {
    fetchTableData();
  }
});

watch(tableData, (rows) => {
  panelRef.value?.mergeLabels(rows as unknown as Record<string, unknown>[]);
  nextTick(() => tableRef.value?.setAdaptive?.());
});

onMounted(() => {
  setTimeout(() => {
    fetchTableData();
  }, 1000);
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <div v-loading="loading" class="flex w-full flex-1 flex-col">
    <AssignManagePanel
      v-if="!loading"
      ref="panelRef"
      :assigned-section-label="t('sysMenu.assignRoleSectionLabel')"
      :get-row-label="getRowLabel"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :seed="seed"
      row-key="roleCode"
    >
      <template #right="{ assign }">
        <div class="h-full">
          <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="mb-3 w-full overflow-auto">
            <el-form-item :label="t('sysMenu.roleName')" prop="roleName">
              <el-input v-model="searchForm.roleName" class="w-45!" clearable />
            </el-form-item>
            <el-form-item :label="t('sysMenu.roleCode')" prop="roleCode">
              <el-input v-model="searchForm.roleCode" class="w-45!" clearable />
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
                row-key="roleCode"
                table-layout="auto"
                @page-current-change="handlePageCurrentChange"
                @page-size-change="handlePageSizeChange"
                @row-dblclick="(row) => assign.toggle(row)"
              />
            </template>
          </TableBar>
        </div>
      </template>
    </AssignManagePanel>
  </div>
</template>
