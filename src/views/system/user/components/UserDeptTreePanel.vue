<script lang="ts" setup>
import { USER_DEPT_ALL_NODE_ID } from '@/views/system/user/constants/user-dept-tree';
import useUserPageState from '@/views/system/user/hooks/useUserPageState';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserDeptTreePanel',
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

const { t } = useI18n();

const { treeKeyword, treeData, deptTreeLoading, currentNodeKey, loadDeptTree, handleDeptNodeClick } =
  useUserPageState();

onMounted(() => {
  loadDeptTree();
});
</script>

<template>
  <div class="user-dept-tree flex h-full flex-col bg-bg_color rounded-sm">
    <!-- 仅搜索 -->
    <div class="shrink-0 p-2">
      <el-input v-model="treeKeyword" :placeholder="t('dept.placeholder.treeKeyword')" clearable />
    </div>

    <!-- 纯树 -->
    <div v-loading="deptTreeLoading" class="min-h-0 flex-1 overflow-auto px-1 pb-2">
      <el-tree
        ref="treeRef"
        :current-node-key="currentNodeKey"
        :data="treeData"
        :expand-on-click-node="false"
        :props="treeProps"
        default-expand-all
        highlight-current
        node-key="id"
        @node-click="handleDeptNodeClick"
      >
        <template #default="{ node, data }">
          <span :title="node.label" class="block truncate text-sm">
            {{ data.id === USER_DEPT_ALL_NODE_ID ? t('users.allDepts') : node.label }}
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
