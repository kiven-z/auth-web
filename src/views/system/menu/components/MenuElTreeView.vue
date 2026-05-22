<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import { transformI18n } from '@/plugins/i18n';
import { useElTreeExpandCollapse } from '@/shared/hooks/useElTreeExpandCollapse';
import useMenuMoreAction from '@/views/system/menu/hooks/useMenuMoreAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/useMenuTableAction';
import type { TreeInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuElTreeView',
});

// 树结构属性
const treeProps = {
  label: 'title',
  children: 'children',
} as const;

const { t } = useI18n();
const { loading, selectedRows, treeData, viewMode, fetchTableData, fetchTreeData, refresh } = useMenuPageState();

const treeRef = ref<TreeInstance>();
const { expandedKeys, expandAll, collapseAll } = useElTreeExpandCollapse({
  treeRef,
  treeData,
});

// 表格操作
const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows } = useMenuTableAction({
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
});

// 更多操作
const { openAssignRoleDrawer, openAssignPermissionDrawer } = useMenuMoreAction({
  fetchTableData,
  fetchTreeData,
  refresh,
});

// 菜单类型 → Tag 展示
const menuTypeTag = (menuType: number) => {
  const map: Record<number, { type: 'primary' | 'success' | 'warning'; key: string }> = {
    0: { type: 'primary', key: 'sysMenu.menuTypeMenu' },
    1: { type: 'warning', key: 'sysMenu.menuTypeIframe' },
    2: { type: 'success', key: 'sysMenu.menuTypeLink' },
  };
  return map[menuType];
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
          default-expand-all
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
                {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
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
                <el-button link size="small" type="danger" @click="deleteBatchRows([data.id])">
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
