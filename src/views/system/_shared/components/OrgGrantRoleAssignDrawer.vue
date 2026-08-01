<script lang="ts" setup>
import { getRolePage } from '@/api/system/role/role';
import type { AssignSeedItem } from '@/components/business/AssignManagePanel';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/business/AssignManagePanel';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'OrgGrantRoleAssignDrawer' });

const props = withDefaults(
  defineProps<{
    leftTitle: string;
    leftSubtitle: string;
    loadAssigned: () => Promise<AssignSeedItem[]>;
    sectionLabel?: string;
    tableTitle?: string;
    assignRowKey?: string;
  }>(),
  {
    assignRowKey: 'id',
  }
);

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const assign = useAssignChecked({
  rowKey: props.assignRowKey,
  getRowLabel: (row) => String(row.roleName ?? ''),
});

const { toggle, applySeed } = assign;

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: true,
  }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = roleState;

useAssignTableLabels(assign, tableData);

const roleDrawerDataColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, props.assignRowKey, { label: t('table.assigned') }),
  {
    label: t('roles.field.roleCode'),
    prop: 'roleCode',
  },
  {
    label: t('roles.field.roleName'),
    prop: 'roleName',
  },
]);

/**
 * 刷新已分配角色
 */
const refreshAssignedSeed = async () => {
  try {
    applySeed(await props.loadAssigned());
  } catch (error: unknown) {
    errorMessage(error);
    applySeed([]);
  }
};

onMounted(() => {
  fetchTableData();
  refreshAssignedSeed();
});

defineExpose({
  getSelectedKeys: assign.getSelectedKeys,
});
</script>

<template>
  <AssignPanel
    :assign="assign"
    :left-subtitle="leftSubtitle"
    :left-title="leftTitle"
    :section-label="sectionLabel ?? t('roles.assign.section')"
  >
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="ph.input('roles.field.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="ph.input('roles.field.roleName')"
          class="w-45!"
          clearable
        />
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
      :title="tableTitle ?? t('roles.title.module')"
      @row-dblclick="(row: Record<string, unknown>) => toggle(row)"
    />
  </AssignPanel>
</template>
