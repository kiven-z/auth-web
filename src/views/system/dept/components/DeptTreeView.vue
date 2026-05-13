<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import { useElTreeExpandCollapse } from '@/shared/hooks/useElTreeExpandCollapse';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import type { TreeInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTreeView',
});

const { t } = useI18n();

const { loading, treeData, fetchTreeData } = useDeptPageState();

const treeRef = ref<TreeInstance>();
const { expandedKeys, expandAll, collapseAll } = useElTreeExpandCollapse({
  treeRef,
  treeData,
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

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
      <div v-loading="loading" class="dept-el-tree-wrap px-2 pb-4">
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
            <div class="flex flex-wrap items-center gap-2 py-1">
              <span class="font-medium">{{ data.deptName }}</span>
              <span class="text-xs text-(--el-text-color-secondary)">({{ data.deptCode }})</span>
              <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
                {{ data.status ? t('dept.statusNormal') : t('dept.statusDisabled') }}
              </el-tag>
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
