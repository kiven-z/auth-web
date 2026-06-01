<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import DeptRowActions from '@/views/system/dept/components/DeptRowActions.vue';
import useDeptMoreAction from '@/views/system/dept/hooks/useDeptMoreAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableAction from '@/views/system/dept/hooks/useDeptTableAction';
import { useElTreeExpandCollapse } from '@/shared/hooks/useElTreeExpandCollapse';
import type { TreeInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTreeView',
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

const { t } = useI18n();

const deptPageState = useDeptPageState();
const { loading, selectedRows, treeData, viewMode, fetchTableData, fetchTreeData, refresh } = deptPageState;

const treeRef = ref<TreeInstance>();
const { expandedKeys, expandAll, collapseAll } = useElTreeExpandCollapse({
  treeRef,
  treeData,
});

const tableActionDeps = {
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
};

const { openDetailDialog, openEditDialog, deleteBatchRows } = useDeptTableAction(tableActionDeps);

const { openAssignRoleDrawer, openAssignPostDrawer } = useDeptMoreAction(tableActionDeps);

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <TableBar :columns="[]" :title="t('dept.pageTitle')" @refresh="fetchTreeData">
    <template #buttons>
      <el-button-group type="primary">
        <!-- 展开全部 -->
        <el-button type="info" @click="expandAll">{{ t('dept.expandAll') }}</el-button>
        <!-- 收起全部 -->
        <el-button type="info" @click="collapseAll">{{ t('dept.collapseAll') }}</el-button>
      </el-button-group>
    </template>

    <template #default>
      <div v-loading="loading" class="dept-el-tree-wrap px-2 pb-4 h-[70vh]">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :default-expanded-keys="expandedKeys"
          :expand-on-click-node="false"
          :props="treeProps"
          class="dept-el-tree"
          default-expand-all
          highlight-current
          node-key="id"
        >
          <template #default="{ data }">
            <div class="flex flex-wrap items-center gap-2 py-1 w-full">
              <span class="font-medium">{{ data.deptName }}</span>
              <span class="text-xs text-(--el-text-color-secondary)">({{ data.deptCode }})</span>
              <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
                {{ data.status ? t('dept.statusNormal') : t('dept.statusDisabled') }}
              </el-tag>
              <div class="dept-el-tree__actions ml-auto" @click.stop>
                <DeptRowActions
                  :delete-batch-rows="deleteBatchRows"
                  compact
                  :open-assign-post-drawer="openAssignPostDrawer"
                  :open-assign-role-drawer="openAssignRoleDrawer"
                  :open-detail-dialog="openDetailDialog"
                  :open-edit-dialog="openEditDialog"
                  :row="data"
                />
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </template>
  </TableBar>
</template>

<style lang="scss" scoped>
.dept-el-tree-wrap {
  min-height: 200px;
}

.dept-el-tree {
  :deep(.el-tree-node__content) {
    height: auto;
    min-height: var(--el-tree-node-content-height);
    align-items: flex-start;
  }
}
</style>
