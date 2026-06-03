<script lang="ts" setup>
import { AuthElTreePanel } from '@/components/business/AuthModuleTableTreeLayout';
import { moveDept } from '@/api/system/dept';
import { operationConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import DeptHeadButtons from '@/views/system/dept/components/DeptHeadButtons.vue';
import DeptRowActions from '@/views/system/dept/components/DeptRowActions.vue';
import useDeptMoreAction from '@/views/system/dept/hooks/useDeptMoreAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableAction from '@/views/system/dept/hooks/useDeptTableAction';
import type { AllowDropType, NodeDropType, TreeNodeData } from 'element-plus';
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

/**
 * 是否允许拖拽到目标节点
 * @param draggingNode - 拖拽节点
 * @param dropNode - 目标节点
 * @param type - 拖拽类型
 * @param type - 是否允许拖拽
 */
const allowDrop = (draggingNode: TreeNodeData, dropNode: TreeNodeData, type: AllowDropType) => {
  // 仅支持「放入为子节点」= 变更父部门；before/after 属于排序能力，后端目前无对应接口
  if (type !== 'inner') {
    return false;
  }
  const dropRow = dropNode?.data as { id?: string; status?: boolean } | undefined;
  // 禁止移动到禁用部门下（后端未限制，但 UI 侧先收口）
  return Boolean(dropRow?.id) && dropRow?.status !== false;
};

/**
 * 是否允许拖拽节点
 * @param draggingNode - 拖拽节点
 * @returns 是否允许拖拽
 */
const allowDrag = (draggingNode: TreeNodeData) => {
  const row = draggingNode?.data as { id?: string } | undefined;
  return Boolean(row?.id);
};

/**
 * 节点拖拽完成
 * @param draggingNode - 拖拽节点
 * @param dropNode - 目标节点
 * @param dropType - 拖拽类型
 */
const onNodeDrop = async (draggingNode: TreeNodeData, dropNode: TreeNodeData, dropType: NodeDropType) => {
  if (dropType !== 'inner') {
    return;
  }

  const dragRow = draggingNode?.data as { id?: string; deptName?: string } | undefined;
  const dropRow = dropNode?.data as { id?: string; deptName?: string } | undefined;
  const deptId = dragRow?.id;
  const newParentId = dropRow?.id;
  if (!deptId || !newParentId) {
    return;
  }

  const confirmed = await operationConfirm();
  if (!confirmed) {
    // 取消时强制刷新，防止树组件短暂的本地重排干扰用户
    await fetchTreeData();
    return;
  }

  try {
    await moveDept(deptId, { parentId: newParentId });
    message(t('tips.operationSuccess'), { type: 'success' });
  } catch (e: unknown) {
    errorMessage(e, { message: `部门移动失败：${dragRow?.deptName ?? deptId} → ${dropRow?.deptName ?? newParentId}` });
  } finally {
    await fetchTreeData();
  }
};

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
    @node-drop="onNodeDrop"
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
