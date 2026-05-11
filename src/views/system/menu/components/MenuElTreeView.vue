<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import { transformI18n } from '@/plugins/i18n';
import useMenuMoreAction from '@/views/system/menu/hooks/useMenuMoreAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/useMenuTableAction';
import type { TreeInstance } from 'element-plus';
import { nextTick, onMounted, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuElTreeView',
});

const { t } = useI18n();
const treeRef = ref<TreeInstance>();

const { loading, selectedRows, treeData, viewMode, fetchTableData, fetchTreeData, refresh } = useMenuPageState();

const { openCreateDialog, openEditDialog, openDetailDialog, handleDelete } = useMenuTableAction({
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
});

const { openAssignRoleDrawer, openAssignPermissionDrawer } = useMenuMoreAction({
  fetchTableData,
  fetchTreeData,
  refresh,
});

// 与 `el-tree` 的 `default-expanded-keys` 同步，数据变更时由 watch 维护
const expandedKeys = ref<string[]>([]);

const treeProps = {
  label: 'title',
  children: 'children',
} as const;

// 菜单类型 → Tag 展示
const menuTypeTag = (menuType: number) => {
  const map: Record<number, { type: 'primary' | 'success' | 'warning'; key: string }> = {
    0: { type: 'primary', key: 'sysMenu.menuTypeMenu' },
    1: { type: 'warning', key: 'sysMenu.menuTypeIframe' },
    2: { type: 'success', key: 'sysMenu.menuTypeLink' },
  };
  return map[menuType];
};

/**
 * 收集树中所有非叶子节点的 id，用于展开/折叠
 */
const collectAllNodeIds = (nodes: any[]): string[] => {
  const ids: string[] = [];
  const walk = (list: any[]) => {
    for (const item of list) {
      ids.push(item.id);
      if (item.children?.length) {
        walk(item.children);
      }
    }
  };
  walk(nodes);
  return ids;
};

/**
 * 展开全部
 */
const expandAll = () => {
  const tree = treeRef.value;
  if (!tree) return;
  expandedKeys.value = collectAllNodeIds(treeData.value ?? []);
};

/**
 * 收起全部
 */
const collapseAll = async () => {
  expandedKeys.value = [];
  await nextTick();
  const store = treeRef.value?.store;
  if (!store) return;
  unref(store)
    ._getAllNodes()
    .forEach((node) => {
      node.collapse();
    });
};

onMounted(() => {
  fetchTreeData();
});
</script>

<template>
  <TableBar :columns="[]" :title="t('sysMenu.tableTitle')" @refresh="fetchTreeData">
    <template #buttons>
      <el-button-group type="primary">
        <!-- 添加 -->
        <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
        <!-- 展开全部 -->
        <el-button type="info" @click="expandAll">{{ t('sysMenu.expandAll') }}</el-button>

        <!-- 收起全部 -->
        <el-button type="info" @click="collapseAll">{{ t('sysMenu.collapseAll') }}</el-button>
      </el-button-group>
    </template>

    <template #default>
      <div v-loading="loading" class="menu-el-tree-wrap px-2 pb-4">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :default-expanded-keys="expandedKeys"
          :expand-on-click-node="false"
          :props="treeProps"
          class="menu-el-tree"
          highlight-current
          node-key="id"
        >
          <template #default="{ data }">
            <div class="flex flex-wrap items-center gap-2 py-1">
              <span class="font-medium">{{ transformI18n(data.title) }}</span>
              <span class="text-xs text-(--el-text-color-secondary)">({{ transformI18n(data.name) }})</span>
              <template v-if="menuTypeTag(data.menuType)">
                <el-tag :type="menuTypeTag(data.menuType)!.type" effect="plain" size="small">
                  {{ t(menuTypeTag(data.menuType)!.key) }}
                </el-tag>
              </template>
              <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
                {{ data.status ? t('sysMenu.statusEnabled') : t('sysMenu.statusDisabled') }}
              </el-tag>
              <div class="ml-auto flex flex-wrap items-center gap-x-1" @click.stop>
                <!-- 添加 -->
                <el-button link size="small" type="primary" @click="openDetailDialog(data)">
                  {{ t('buttons.actionView') }}
                </el-button>

                <!-- 编辑 -->
                <el-button link size="small" type="primary" @click="openEditDialog(data)">
                  {{ t('buttons.actionEdit') }}
                </el-button>

                <!-- 删除 -->
                <el-button link size="small" type="danger" @click="handleDelete([data.id])">
                  {{ t('buttons.actionDelete') }}
                </el-button>

                <!-- 更多 -->
                <el-dropdown class="ml-1" trigger="click" @click.stop>
                  <el-button class="el-dropdown-link" link size="small" type="primary">
                    {{ t('buttons.actionMore') }}
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="openAssignRoleDrawer(data)">
                        {{ t('sysMenu.assignRole') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="openAssignPermissionDrawer(data)">
                        {{ t('sysMenu.assignPermission') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </template>
  </TableBar>
</template>

<style lang="scss" scoped>
.menu-el-tree-wrap {
  min-height: 200px;
}

.menu-el-tree {
  :deep(.el-tree-node__content) {
    height: auto;
    min-height: var(--el-tree-node-content-height);
    align-items: flex-start;
  }
}
</style>
