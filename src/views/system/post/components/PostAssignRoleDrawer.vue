<script lang="tsx" setup>
import { getPostRoles } from '@/api/system/post';
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

defineOptions({ name: 'PostAssignRoleDrawer' });

const props = defineProps<{
  postId: string;
  postName: string;
  postCode: string;
}>();

const { t } = useI18n();
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
    roleTypes: [...ORG_GRANT_DEFAULT_ROLE_TYPES],
  }),
  errorI18nKey: 'roles.loadFailed',
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = roleState;

/**
 * 岗位 grant 仅允许 3/4（与部门 grant_table 口径一致）
 */
const normalizePostRoleTypes = (values: number[]) => {
  if (values.length === 0) {
    searchForm.roleTypes = ORG_GRANT_DEFAULT_ROLE_TYPES;
  }
};

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

const handleRowDblclick = (row: SysRolePageRow) => {
  toggle(row as unknown as Record<string, unknown>);
};

const fetchPostAssignedRoles = async () => {
  try {
    const rows = await getPostRoles(props.postId);
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
  fetchPostAssignedRoles();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <AssignPanel
    :assign="assign"
    :left-subtitle="`${postName}（${postCode}）`"
    :left-title="t('post.assignCurrentPost')"
    :section-label="t('roles.assignedRolesSectionLabel')"
  >
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <el-form-item :label="t('roles.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="t('roles.placeholder.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="t('roles.placeholder.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.roleType')" prop="roleTypes">
        <el-select
          v-model="searchForm.roleTypes"
          :placeholder="t('roles.roleType')"
          class="w-52!"
          clearable
          collapse-tags
          collapse-tags-tooltip
          multiple
          @change="normalizePostRoleTypes"
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
