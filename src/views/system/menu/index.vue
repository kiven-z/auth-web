<script lang="ts" setup>
import MenuElTreeView from '@/views/system/menu/components/MenuElTreeView.vue';
import MenuTableTreeView from '@/views/system/menu/components/MenuTableTreeView.vue';
import MenuTableView from '@/views/system/menu/components/MenuTableView.vue';
import useMenuPageState, { type MenuViewMode } from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/useMenuTableAction';
import useMenuTableColumns from '@/views/system/menu/hooks/useMenuTableColumns';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemMenu',
});

const { t } = useI18n();
const { tableColumns, treeColumns } = useMenuTableColumns();
const viewMode = ref<MenuViewMode>('table');

const segmentedOptions = computed(() => [
  { label: t('sysMenu.viewTableTitle'), value: 'table' as const },
  { label: t('sysMenu.viewTableTreeTitle'), value: 'tableTree' as const },
  { label: t('sysMenu.viewTreeTitle'), value: 'tree' as const },
]);

const {
  loading,
  selectedRows,
  tableData,
  searchForm,
  fetchTableData,
  resetQuery,
  handleSelectionChange,
  treeData,
  fetchTreeData,
} = useMenuPageState();

const {
  openCreateDialog,
  openEditDialog,
  openDetailDialog,
  handleDelete,
  confirmBatchEnable,
  confirmBatchDisable,
  openAssignRoleDrawer,
  openAssignPermissionDrawer,
} = useMenuTableAction({
  fetchTableData,
  fetchTreeData,
  viewMode,
  selectedRows,
});

watch(viewMode, (mode) => {
  if (mode === 'table') {
    void fetchTableData();
  } else {
    void fetchTreeData();
  }
});

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div>
    <div class="flex justify-center pt-3 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <MenuTableView
      v-if="viewMode === 'table'"
      :columns="tableColumns"
      :fetch-table-data="fetchTableData"
      :handle-selection-change="handleSelectionChange"
      :loading="loading"
      :on-add="openCreateDialog"
      :on-assign-permission="openAssignPermissionDrawer"
      :on-assign-role="openAssignRoleDrawer"
      :on-batch-delete="() => handleDelete(selectedRows)"
      :on-batch-disable="confirmBatchDisable"
      :on-batch-enable="confirmBatchEnable"
      :on-delete="(row) => handleDelete([row.id])"
      :on-edit="openEditDialog"
      :on-view="openDetailDialog"
      :reset-query="resetQuery"
      :search-form="searchForm"
      :selected-row-ids="selectedRows"
      :table-data="tableData"
    />

    <MenuTableTreeView
      v-else-if="viewMode === 'tableTree'"
      :columns="treeColumns"
      :fetch-tree-data="fetchTreeData"
      :loading="loading"
      :on-add="openCreateDialog"
      :on-assign-permission="openAssignPermissionDrawer"
      :on-assign-role="openAssignRoleDrawer"
      :on-delete="(row) => handleDelete([row.id])"
      :on-edit="openEditDialog"
      :on-view="openDetailDialog"
      :tree-data="treeData"
    />

    <MenuElTreeView
      v-else
      :fetch-tree-data="fetchTreeData"
      :loading="loading"
      :on-add="openCreateDialog"
      :on-assign-permission="openAssignPermissionDrawer"
      :on-assign-role="openAssignRoleDrawer"
      :on-delete="(row) => handleDelete([row.id])"
      :on-edit="openEditDialog"
      :on-view="openDetailDialog"
      :tree-data="treeData"
    />
  </div>
</template>
