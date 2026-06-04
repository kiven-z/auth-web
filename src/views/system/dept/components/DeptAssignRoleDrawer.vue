<script lang="tsx" setup>
import { getDeptRoles } from '@/api/system/dept';
import { getRolePage, type SysRolePageRow } from '@/api/system/role';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/business/AssignManagePanel';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import { errorMessage } from '@/shared/messaging/message';
import {
  ORG_GRANT_DEFAULT_ROLE_TYPES,
  ORG_GRANT_ROLE_TYPE_OPTIONS,
} from '@/views/system/_shared/constants/org-grant-role-options';
import { ElTag, type FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptAssignRoleDrawer' });

const props = defineProps<{
  deptId: string;
  deptName: string;
  deptCode: string;
}>();

const { t } = useI18n();
const searchFormRef = ref<FormInstance>();

// 分配角色
const assign = useAssignChecked({
  rowKey: 'roleCode',
  getRowLabel: (row) => String(row.roleName ?? ''),
});

const { getSelectedKeys, toggle, applySeed } = assign;

// 角色分页状态
const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: true,
    roleTypes: [...ORG_GRANT_DEFAULT_ROLE_TYPES],
  }),
  errorI18nKey: 'roles.loadFailed',
});

// 角色分页数据
const { tableData, loading, searchForm, fetchTableData, resetQuery } = roleState;

/**
 * 部门 grant 仅允许 3/4
 */
const normalizeDeptRoleTypes = (values: number[]) => {
  if (values.length === 0) {
    searchForm.roleTypes = ORG_GRANT_DEFAULT_ROLE_TYPES;
  }
};

// 使用分配表标签
useAssignTableLabels(assign, tableData);

// 角色分配抽屉数据列
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
  {
    label: t('roles.roleType'),
    prop: 'roleType',
    width: 120,
    formatter: (row: SysRolePageRow) => {
      const option = ORG_GRANT_ROLE_TYPE_OPTIONS.find((item) => item.value === row.roleType);
      return (
        <ElTag type={option.tagType} effect="plain">
          {t(option.labelKey)}
        </ElTag>
      );
    },
  },
]);

/**
 * 双击行切换分配状态
 */
const handleRowDblclick = (row: SysRolePageRow) => {
  toggle(row as unknown as Record<string, unknown>);
};

/**
 * 加载部门已分配角色，写入勾选状态
 */
const fetchDeptAssignedRoles = async () => {
  try {
    const rows = await getDeptRoles(props.deptId);
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
  fetchDeptAssignedRoles();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <AssignPanel
    :assign="assign"
    :left-subtitle="`${deptName}（${deptCode}）`"
    :left-title="t('dept.assignCurrentDept')"
    :section-label="t('roles.assignedRolesSectionLabel')"
  >
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 角色编码 -->
      <el-form-item :label="t('roles.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="t('roles.placeholder.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 角色名称 -->
      <el-form-item :label="t('roles.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="t('roles.placeholder.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 角色类型（多选，仅业务/自定义，对应后端 roleTypes IN） -->
      <el-form-item :label="t('roles.roleType')" prop="roleTypes">
        <el-select
          v-model="searchForm.roleTypes"
          :placeholder="t('roles.roleType')"
          class="w-52!"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
          @change="normalizeDeptRoleTypes"
        >
          <el-option
            v-for="opt in ORG_GRANT_ROLE_TYPE_OPTIONS"
            :key="opt.value"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
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
