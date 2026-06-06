<script lang="ts" setup>
import { AuthElTreePanel } from '@/components/business/AuthElTreePanel';
import DeptHeadButtons from '@/views/system/dept/components/DeptHeadButtons.vue';
import DeptRowActions from '@/views/system/dept/components/DeptRowActions.vue';
import useDeptMoreAction from '@/views/system/dept/hooks/useDeptMoreAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableAction from '@/views/system/dept/hooks/useDeptTableAction';
import { useDeptTreeDrag } from '@/views/system/dept/hooks/useDeptTreeDrag';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTreeView',
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

const { t } = useI18n();

const { loading, selectedRows, treeData, viewMode, fetchTableData, fetchTreeData, refresh } = useDeptPageState();

const tableActionDeps = {
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
};

const { openCreateDialog, openDetailDialog, openEditDialog, deleteBatchRows } = useDeptTableAction(tableActionDeps);

const { openAssignRoleDrawer } = useDeptMoreAction(tableActionDeps);

const { allowDrag, allowDrop, handleNodeDrop } = useDeptTreeDrag({
  treeData,
  onMoved: fetchTreeData,
});

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <AuthElTreePanel
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :collapse-all-label="t('dept.collapseAll')"
    :draggable="true"
    :expand-all-label="t('dept.expandAll')"
    :loading="loading"
    :title="t('dept.pageTitle')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="fetchTreeData"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <DeptHeadButtons />
    </template>

    <template #meta="{ data }">
      <span :class="{ 'text-(--el-text-color-secondary)': !data.status }" class="font-medium">{{ data.deptName }}</span>
      <span class="text-xs text-(--el-text-color-secondary)">({{ data.deptCode }})</span>
      <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
        {{ data.status ? t('dept.statusNormal') : t('dept.statusDisabled') }}
      </el-tag>
    </template>

    <template #actions="{ data }">
      <DeptRowActions
        :delete-batch-rows="deleteBatchRows"
        :open-assign-role-drawer="openAssignRoleDrawer"
        :open-create-dialog="openCreateDialog"
        :open-detail-dialog="openDetailDialog"
        :open-edit-dialog="openEditDialog"
        :row="data"
        compact
        show-add-child
      />
    </template>
  </AuthElTreePanel>
</template>
