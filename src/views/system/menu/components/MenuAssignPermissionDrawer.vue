<script lang="ts" setup>
import { getMenuPermissions } from '@/api/system/menu';
import type { SysPermissionPageRow } from '@/api/system/permission';
import { getPermissionPage } from '@/api/system/permission';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/business/AssignManagePanel';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const searchFormRef = ref<FormInstance>();

const assign = useAssignChecked({
  rowKey: 'permissionCode',
  getRowLabel: (row) => String(row.permissionName ?? ''),
});

const { getSelectedKeys, toggle, applySeed } = assign;

const permissionState = usePaginationState<SysPermissionPageRow>({
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

const { tableData, loading, searchForm, fetchTableData, resetQuery } = permissionState;

useAssignTableLabels(assign, tableData);

const permissionDrawerColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, 'permissionCode', { label: t('table.assigned') }),
  {
    label: t('permissions.permissionName'),
    prop: 'permissionName',
  },
  {
    label: t('permissions.permissionCode'),
    prop: 'permissionCode',
  },
]);

/**
 * 双击行切换分配状态
 */
const handleRowDblclick = (row: SysPermissionPageRow) => {
  toggle(row as unknown as Record<string, unknown>);
};

/**
 * 加载菜单已分配权限，写入勾选状态
 */
const fetchMenuPermissions = async () => {
  try {
    const list = await getMenuPermissions(props.menuId);
    applySeed(
      list
        .filter((row) => row.assigned)
        .map((row) => ({
          key: row.permissionCode,
          label: row.permissionName,
        }))
    );
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
    applySeed([]);
  }
};

onMounted(() => {
  fetchTableData();
  fetchMenuPermissions();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <AssignPanel
    :assign="assign"
    :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
    :left-title="t('sysMenu.assignCurrentMenu')"
    :section-label="t('permissions.assignSectionLabel')"
  >
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="mb-3 w-full overflow-auto pl-8 pt-3">
      <!-- 权限名称 -->
      <el-form-item :label="t('permissions.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="t('permissions.assignSearch')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 权限码 -->
      <el-form-item :label="t('permissions.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="t('permissions.placeholder.permissionCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <!-- 表单搜索 -->
      <el-form-item>
        <!-- 搜索 -->
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <!-- 重置 -->
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="permissionDrawerColumns"
      :state="permissionState"
      :title="t('sysMenu.assignPermissionTitle')"
      row-key="permissionCode"
      @row-dblclick="handleRowDblclick"
    />
  </AssignPanel>
</template>
