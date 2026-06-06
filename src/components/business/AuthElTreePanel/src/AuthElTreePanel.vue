<script lang="ts" setup>
import { useElTreeExpandCollapse } from '@/components/business/AuthElTreePanel/src/useElTreeExpandCollapse';
import TableBar from '@/components/ui/TableBar';
import type { TreeInstance } from 'element-plus';
import { ref, toRef, useAttrs } from 'vue';

defineOptions({
  name: 'AuthElTreePanel',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title?: string;
    loading?: boolean;
    treeData?: unknown[];
    treeProps?: Record<string, string>;
    nodeKey?: string;
    expandAllLabel: string;
    collapseAllLabel: string;
    /** 树容器额外 class，默认固定高度便于与表格视图对齐 */
    contentClass?: string;
  }>(),
  {
    title: '',
    loading: false,
    treeData: () => [],
    treeProps: () => ({ label: 'label', children: 'children' }),
    nodeKey: 'id',
    contentClass: 'h-[70vh]',
  }
);

const emit = defineEmits<{
  refresh: [];
}>();

const treeRef = ref<TreeInstance>();
const treeDataRef = toRef(props, 'treeData');
const attrs = useAttrs();

const { expandedKeys, expandAll, collapseAll } = useElTreeExpandCollapse({
  treeRef,
  treeData: treeDataRef,
  nodeIdKey: props.nodeKey,
});

function handleRefresh() {
  emit('refresh');
}
</script>

<template>
  <TableBar :columns="[]" :title="title" @refresh="handleRefresh">
    <template #buttons>
      <slot name="toolbar" />
      <el-button-group type="primary" class="ml-1">
        <el-button type="info" @click="expandAll">{{ expandAllLabel }}</el-button>
        <el-button type="info" @click="collapseAll">{{ collapseAllLabel }}</el-button>
      </el-button-group>
    </template>

    <template #default>
      <div v-loading="loading" :class="contentClass" class="min-h-50 overflow-auto px-2">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :default-expanded-keys="expandedKeys"
          :expand-on-click-node="false"
          :node-key="nodeKey"
          :props="treeProps"
          default-expand-all
          highlight-current
          v-bind="attrs"
        >
          <template #default="{ data }">
            <div class="auth-el-tree-panel__row flex flex-wrap items-center gap-2 py-1 w-full min-w-0">
              <div class="auth-el-tree-panel__meta flex flex-wrap items-center gap-2 min-w-0 flex-1">
                <slot :data="data" name="meta" />
              </div>
              <div class="auth-el-tree-panel__actions ml-auto flex shrink-0 flex-wrap items-center gap-x-1" @click.stop>
                <slot :data="data" name="actions" />
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </template>
  </TableBar>
</template>
