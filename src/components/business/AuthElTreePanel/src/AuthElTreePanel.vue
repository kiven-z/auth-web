<script lang="ts" setup>
import { useElTreeExpandCollapse } from '@/components/business/AuthElTreePanel/src/useElTreeExpandCollapse';
import TableBar from '@/components/ui/TableBar';
import { useTimeoutFn } from '@vueuse/core';
import type { TreeInstance } from 'element-plus';
import { ref, toRef, useAttrs } from 'vue';

defineOptions({
  name: 'AuthElTreePanel',
  inheritAttrs: false,
});

/** 鼠标移出行后，延迟卸载操作区，便于移入下拉菜单 */
const ACTIONS_LEAVE_DELAY_MS = 300;

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
    /** 仅在 hover 行时挂载操作区，减轻大树首屏渲染压力 */
    showActionsOnHover?: boolean;
  }>(),
  {
    title: '',
    loading: false,
    treeData: () => [],
    treeProps: () => ({ label: 'label', children: 'children' }),
    nodeKey: 'id',
    contentClass: 'h-[70vh]',
    showActionsOnHover: false,
  }
);

const emit = defineEmits<{
  refresh: [];
}>();

const treeRef = ref<TreeInstance>();
const treeDataRef = toRef(props, 'treeData');
const attrs = useAttrs();
const hoveredNodeKey = ref<string | null>(null);
const pinnedNodeKey = ref<string | null>(null);
const leaveTargetKey = ref<string | null>(null);

const { start: startLeaveTimer, stop: stopLeaveTimer } = useTimeoutFn(
  () => {
    const key = leaveTargetKey.value;
    if (!key) {
      return;
    }
    if (hoveredNodeKey.value === key) {
      hoveredNodeKey.value = null;
    }
    if (pinnedNodeKey.value === key) {
      pinnedNodeKey.value = null;
    }
    leaveTargetKey.value = null;
  },
  ACTIONS_LEAVE_DELAY_MS,
  { immediate: false }
);

const { expandedKeys, expandAll, collapseAll } = useElTreeExpandCollapse({
  treeRef,
  treeData: treeDataRef,
  nodeIdKey: props.nodeKey,
});

/**
 * 解析树节点主键
 * @param data 节点数据
 * @returns 节点主键字符串
 */
function resolveNodeKey(data: Record<string, unknown>): string {
  const key = data[props.nodeKey];
  return key == null ? '' : String(key);
}

/**
 * 当前行是否展示操作区
 * @param data 节点数据
 * @returns 是否展示
 */
function isActionsVisible(data: Record<string, unknown>): boolean {
  if (!props.showActionsOnHover) {
    return true;
  }
  const key = resolveNodeKey(data);
  if (!key) {
    return false;
  }
  return hoveredNodeKey.value === key || pinnedNodeKey.value === key;
}

/**
 * 鼠标移入树行
 * @param data 节点数据
 */
function handleRowEnter(data: Record<string, unknown>) {
  if (!props.showActionsOnHover) {
    return;
  }
  stopLeaveTimer();
  leaveTargetKey.value = null;
  hoveredNodeKey.value = resolveNodeKey(data);
}

/**
 * 鼠标移出树行
 * @param data 节点数据
 */
function handleRowLeave(data: Record<string, unknown>) {
  if (!props.showActionsOnHover) {
    return;
  }
  leaveTargetKey.value = resolveNodeKey(data);
  startLeaveTimer();
}

/**
 * 在操作区按下指针时固定当前行，避免移入下拉菜单前操作区被卸载
 * @param data 节点数据
 */
function handleActionsPointerDown(data: Record<string, unknown>) {
  if (!props.showActionsOnHover) {
    return;
  }
  pinnedNodeKey.value = resolveNodeKey(data);
}

function handleRefresh() {
  emit('refresh');
}
</script>

<template>
  <TableBar :columns="[]" :title="title" @refresh="handleRefresh">
    <template #buttons>
      <slot name="toolbar" />
      <el-button-group class="ml-1" type="primary">
        <el-button type="info" @click="expandAll">{{ expandAllLabel }}</el-button>
        <el-button type="info" @click="collapseAll">{{ collapseAllLabel }}</el-button>
      </el-button-group>
    </template>

    <template #default>
      <div v-if="$slots.search" class="px-2 pb-2">
        <slot name="search" />
      </div>
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
            <div
              class="flex w-full min-w-0 flex-wrap items-center gap-2 py-1"
              @mouseenter="handleRowEnter(data)"
              @mouseleave="handleRowLeave(data)"
            >
              <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <slot :data="data" name="meta" />
              </div>
              <div
                class="ml-auto flex min-h-7 shrink-0 flex-wrap items-center gap-x-1"
                @click.stop
                @pointerdown.stop="handleActionsPointerDown(data)"
              >
                <div v-if="isActionsVisible(data)" class="flex flex-wrap items-center gap-x-1">
                  <slot :data="data" name="actions" />
                </div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </template>
  </TableBar>
</template>
