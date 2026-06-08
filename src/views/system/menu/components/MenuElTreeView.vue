<script lang="ts" setup>
import { AuthElTreePanel } from '@/components/business/AuthElTreePanel';
import { transformI18n } from '@/plugins/i18n';
import useMenuMoreAction from '@/views/system/menu/hooks/useMenuMoreAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/useMenuTableAction';
import { useMenuTreeDrag } from '@/views/system/menu/hooks/useMenuTreeDrag';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuElTreeView',
});

const treeProps = {
  label: 'title',
  children: 'children',
} as const;

const { t } = useI18n();
const { loading, selectedRows, treeData, viewMode, fetchTableData, fetchTreeData, refresh } = useMenuPageState();

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows } = useMenuTableAction({
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

const { allowDrag, allowDrop, handleNodeDrop } = useMenuTreeDrag({
  treeData,
  onMoved: fetchTreeData,
});

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
  <AuthElTreePanel
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :collapse-all-label="t('sysMenu.collapseAll')"
    :draggable="true"
    :expand-all-label="t('sysMenu.expandAll')"
    :loading="loading"
    :title="t('sysMenu.tableTitle')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="fetchTreeData"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
    </template>

    <template #meta="{ data }">
      <span class="font-medium">{{ transformI18n(data.title) }}</span>
      <el-text type="info">({{ transformI18n(data.name) }})</el-text>
      <template v-if="menuTypeTag(data.menuType)">
        <el-tag :type="menuTypeTag(data.menuType)!.type" effect="plain" size="small">
          {{ t(menuTypeTag(data.menuType)!.key) }}
        </el-tag>
      </template>
      <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
        {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
      </el-tag>
    </template>

    <template #actions="{ data }">
      <el-button link size="small" type="primary" @click="openDetailDialog(data)">
        {{ t('buttons.actionView') }}
      </el-button>
      <el-button link size="small" type="primary" @click="openEditDialog(data)">
        {{ t('buttons.actionEdit') }}
      </el-button>
      <el-button link size="small" type="danger" @click="deleteBatchRows([data.id])">
        {{ t('buttons.actionDelete') }}
      </el-button>
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
    </template>
  </AuthElTreePanel>
</template>
