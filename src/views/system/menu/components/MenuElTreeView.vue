<script lang="ts" setup>
import { AuthElTreePanel } from '@/components/business/AuthElTreePanel';
import { transformI18n } from '@/plugins/i18n';
import { SYS_MENU_PERMS } from '@/views/system/menu/constants/permissions';
import MenuRowActions from '@/views/system/menu/components/MenuRowActions.vue';
import useMenuMoreAction from '@/views/system/menu/hooks/actions/useMenuMoreAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/actions/useMenuTableAction';
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
    :show-actions-on-hover="true"
    :title="t('sysMenu.tableTitle')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="fetchTreeData"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <el-button v-perms="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
        {{ t('buttons.actionAdd') }}
      </el-button>
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
      <MenuRowActions
        :delete-batch-rows="deleteBatchRows"
        :open-assign-permission-drawer="openAssignPermissionDrawer"
        :open-assign-role-drawer="openAssignRoleDrawer"
        :open-create-dialog="openCreateDialog"
        :open-detail-dialog="openDetailDialog"
        :open-edit-dialog="openEditDialog"
        :row="data"
        show-add-child
      />
    </template>
  </AuthElTreePanel>
</template>
