<script lang="ts" setup>
import ElTreePanel from '@/components/table/ElTreePanel';
import DeptHeadButtons from '@/features/system/dept/components/actions/DeptHeadButtons.vue';
import DeptRowActions from '@/features/system/dept/components/actions/DeptRowActions.vue';
import useDeptPageState from '@/features/system/dept/hooks/useDeptPageState';
import { useDeptTreeDrag } from '@/features/system/dept/hooks/useDeptTreeDrag';
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

const { loading, treeData, loadTreeListInto } = useDeptPageState();

const { allowDrag, allowDrop, handleNodeDrop } = useDeptTreeDrag({
  treeData,
  onMoved: () => loadTreeListInto('tree'),
});

onMounted(() => {
  loadTreeListInto('tree');
});
</script>

<template>
  <ElTreePanel
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :collapse-all-label="t('dept.page.tree.collapseAll')"
    :draggable="true"
    :expand-all-label="t('dept.page.tree.expandAll')"
    :loading="loading"
    :show-actions-on-hover="true"
    :title="t('dept.page.title')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="loadTreeListInto('tree')"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <DeptHeadButtons />
    </template>

    <template #meta="{ data }">
      <span :class="{ 'text-(--el-text-color-secondary)': !data.status }" class="font-medium">{{ data.deptName }}</span>
      <el-text type="info">({{ data.deptCode }})</el-text>
      <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
        {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
      </el-tag>
    </template>

    <template #actions="{ data }">
      <DeptRowActions :row="data" show-add-child />
    </template>
  </ElTreePanel>
</template>
