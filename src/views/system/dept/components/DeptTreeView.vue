<script lang="ts" setup>
import ElTreePanel from '@/components/domain/tree/ElTreePanel';
import { useRenderIcon } from '@/components/ui/Icon';
import DeptHeadButtons from '@/views/system/dept/components/DeptHeadButtons.vue';
import DeptRowActions from '@/views/system/dept/components/DeptRowActions.vue';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import { useDeptTreeDrag } from '@/views/system/dept/hooks/useDeptTreeDrag';
import { useDebounceFn } from '@vueuse/core';
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTreeView',
});

const treeProps = {
  label: 'deptName',
  children: 'children',
} as const;

const { t } = useI18n();

const { loading, treeData, treeKeyword, fetchTreeData } = useDeptPageState();

const debouncedFetchTree = useDebounceFn(() => {
  fetchTreeData();
}, 300);

watch(treeKeyword, () => {
  debouncedFetchTree();
});

const { allowDrag, allowDrop, handleNodeDrop } = useDeptTreeDrag({
  treeData,
  onMoved: fetchTreeData,
});

onMounted(() => {
  fetchTreeData();
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
    @refresh="fetchTreeData"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <DeptHeadButtons />
    </template>

    <template #search>
      <el-input
        v-model="treeKeyword"
        :placeholder="t('dept.placeholder.treeKeyword')"
        :prefix-icon="useRenderIcon('ri/search-line')"
        clearable
      />
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
