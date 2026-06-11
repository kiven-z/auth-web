<script lang="ts" setup>
import { getMenuRoles } from '@/api/system/menu';
import { getRolePage, type SysRolePageRow } from '@/api/system/role';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/business/AssignManagePanel';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { errorMessage } from '@/ui/feedback/message';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const assign = useAssignChecked({
  rowKey: 'roleCode',
  getRowLabel: (row) => String(row.roleName ?? ''),
});

const { getSelectedKeys, toggle, applySeed } = assign;

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: true,
    roleTypes: [2],
  }),
  errorI18nKey: 'roles.loadFailed',
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = roleState;

useAssignTableLabels(assign, tableData);

const roleDrawerDataColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, 'roleCode', { label: t('table.assigned') }),
  {
    label: t('roles.roleCode'),
    prop: 'roleCode',
  },
  {
    label: t('roles.roleName'),
    prop: 'roleName',
  },
]);

/**
 * 双击行切换分配状态
 */
const handleRowDblclick = (row: SysRolePageRow) => {
  toggle(row as unknown as Record<string, unknown>);
};

/**
 * 加载菜单已分配角色，写入勾选状态
 */
const fetchMenuRoles = async () => {
  try {
    const rows = await getMenuRoles(props.menuId);
    applySeed(
      rows.map((row) => ({
        key: row.roleCode,
        label: row.roleName,
      }))
    );
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'tips.assignLoadFailed' });
    applySeed([]);
  }
};

onMounted(() => {
  fetchTableData();
  fetchMenuRoles();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <AssignPanel :assign="assign" :left-title="t('sysMenu.name')" :section-label="t('roles.assignedRolesSectionLabel')">
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 角色编码 -->
      <el-form-item :label="t('roles.roleCode')" prop="roleCode">
        <el-input v-model="searchForm.roleCode" :placeholder="ph.input('roles.roleCode')" class="w-45!" clearable />
      </el-form-item>
      <!-- 角色名称 -->
      <el-form-item :label="t('roles.roleName')" prop="roleName">
        <el-input v-model="searchForm.roleName" :placeholder="ph.input('roles.roleName')" class="w-45!" clearable />
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="roleDrawerDataColumns"
      :state="roleState"
      :title="t('roles.moduleName')"
      @row-dblclick="handleRowDblclick"
    />
  </AssignPanel>
</template>
