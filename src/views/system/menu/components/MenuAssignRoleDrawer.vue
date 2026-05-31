<script lang="ts" setup>
import { getMenuRoles } from '@/api/system/menu';
import { getRolePage, type SysRolePageRow } from '@/api/system/role';
import { createAssignCheckboxColumn, useAssignChecked } from '@/components/business/AssignManagePanel';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/components/ui/AuthPagedTable/src/usePaginationState';
import { errorMessage } from '@/shared/messaging/message';
import { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const tableRef = ref<{ setAdaptive?: () => Promise<void> } | null>(null);
const searchFormRef = ref<FormInstance>();

const assign = useAssignChecked({
  rowKey: 'roleCode',
  getRowLabel: (row) => String(row.roleName ?? ''),
});

const {
  assignedTags,
  canClearRemovable,
  applySeed,
  mergeLabels,
  isLocked,
  removeKey,
  clearRemovable,
  getSelectedKeys,
  toggle,
} = assign;

const {
  tableData,
  loading,
  pagination,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
} = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: true,
    roleType: 2,
  }),
  errorI18nKey: 'roles.loadFailed',
});

const roleDrawerDataColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumn(assign, 'roleCode', { label: t('table.assigned') }),
  {
    label: t('sysMenu.roleCode'),
    prop: 'roleCode',
  },
  {
    label: t('sysMenu.roleName'),
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
    errorMessage(error, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
    applySeed([]);
  }
};

watch(
  tableData,
  (rows) => {
    mergeLabels(rows);
  },
  { immediate: true }
);

onMounted(() => {
  fetchTableData();
  fetchMenuRoles();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="8">
      <el-card shadow="never">
        <template #header>
          <div>
            <!-- 模块标题 -->
            <div class="font-semibold">{{ t('sysMenu.name') }}</div>
          </div>
        </template>

        <div class="flex justify-between">
          <!-- 分配区域标题 -->
          <div class="text-xs font-semibold text-(--el-text-color-secondary)">{{ t('roles.assignSectionLabel') }}</div>
          <el-button :disabled="!canClearRemovable" link type="danger" @click="clearRemovable">
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </div>

        <div v-if="assignedTags.length > 0">
          <el-tag
            v-for="tag in assignedTags"
            :key="tag.key"
            :closable="!isLocked(tag.key)"
            class="mx-1"
            effect="light"
            type="success"
            @close="removeKey(tag.key)"
          >
            <el-tooltip :content="tag.key" :show-after="400" placement="top">
              <span>{{ tag.label }}</span>
            </el-tooltip>
          </el-tag>
        </div>
        <div v-else class="flex items-center justify-center">
          <el-text type="info">
            {{ t('tips.assignEmptySelected') }}
          </el-text>
        </div>
      </el-card>
    </el-col>

    <el-col :span="16">
      <div v-loading="loading" class="flex w-full flex-1 flex-col">
        <el-form
          ref="searchFormRef"
          :inline="true"
          :model="searchForm"
          class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
        >
          <!-- 角色编码 -->
          <el-form-item :label="t('roles.roleCode')" prop="roleCode">
            <el-input v-model="searchForm.roleCode" class="w-45!" clearable />
          </el-form-item>
          <!-- 角色名称 -->
          <el-form-item :label="t('roles.roleName')" prop="roleName">
            <el-input v-model="searchForm.roleName" class="w-45!" clearable />
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

        <TableBar
          :columns="roleDrawerDataColumns"
          :title="t('roles.pageTitle')"
          @fullscreen="tableRef?.setAdaptive()"
          @refresh="fetchTableData"
        >
          <template #default="{ size, dynamicColumns }">
            <AuthDataTable
              ref="tableRef"
              :columns="dynamicColumns"
              :data="tableData"
              :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
              :loading="loading"
              :pagination="pagination"
              :size="size"
              adaptive
              align-whole="center"
              border
              highlight-current-row
              row-key="id"
              table-layout="auto"
              @page-size-change="handlePageSizeChange"
              @page-current-change="handlePageCurrentChange"
              @row-dblclick="handleRowDblclick"
            />
          </template>
        </TableBar>
      </div>
    </el-col>
  </el-row>
</template>
