<script lang="ts" setup>
import type { SysPermissionPageRow } from '@/api/system/permission';
import { getPermissionPage } from '@/api/system/permission';
import type { AssignSeedItem } from '@/components/business/AssignManagePanel';
import AssignPanel, {
  createAssignCheckboxColumn,
  useAssignChecked,
  useAssignTableLabels,
} from '@/components/business/AssignManagePanel';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { errorMessage } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PermissionAssignDrawer' });

const props = defineProps<{
  leftTitle: string;
  leftSubtitle: string;
  tableTitle: string;
  loadAssigned: () => Promise<AssignSeedItem[]>;
  sectionLabel?: string;
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const assign = useAssignChecked({
  rowKey: 'id',
  getRowLabel: (row) => String(row.permissionName ?? ''),
});

const { getSelectedKeys, toggle, applySeed } = assign;

// 权限状态
const permissionState = usePaginationState<SysPermissionPageRow>({
  searchForm: reactive({
    permissionName: undefined,
    permissionCode: undefined,
  }),
  defaultPageSize: 30,
  errorI18nKey: 'tips.assignLoadFailed',
  fetchApi: (query) =>
    getPermissionPage({
      pageIndex: query.pageIndex as number,
      pageSize: query.pageSize as number,
      permissionName: query.permissionName as string,
      permissionCode: query.permissionCode as string,
      status: true,
    }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = permissionState;

useAssignTableLabels(assign, tableData);

// 权限分配列
const permissionDrawerColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, 'id', { label: t('table.assigned') }),
  {
    label: t('permissions.field.permissionName'),
    prop: 'permissionName',
  },
  {
    label: t('permissions.field.permissionCode'),
    prop: 'permissionCode',
  },
]);

/**
 * 双击行切换分配状态
 */
const refreshAssignedSeed = async () => {
  try {
    applySeed(await props.loadAssigned());
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'tips.assignLoadFailed' });
    applySeed([]);
  }
};

onMounted(() => {
  fetchTableData();
  refreshAssignedSeed();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <AssignPanel
    :assign="assign"
    :left-subtitle="leftSubtitle"
    :left-title="leftTitle"
    :section-label="sectionLabel ?? t('permissions.assign.sectionLabel')"
  >
    <el-form ref="searchFormRef" :model="searchForm" class="mb-3 w-full overflow-auto pl-8 pt-3" inline>
      <el-form-item :label="t('permissions.field.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="ph.input('permissions.field.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('permissions.field.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="ph.input('permissions.field.permissionCode')"
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
      :columns="permissionDrawerColumns"
      :state="permissionState"
      :title="tableTitle"
      row-key="id"
      @row-dblclick="(row: Record<string, unknown>) => toggle(row)"
    />
  </AssignPanel>
</template>
