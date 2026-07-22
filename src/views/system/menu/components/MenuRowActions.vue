<script lang="ts" setup>
import { treeRowActionsLockKey } from '@/components/business/AuthElTreePanel/src/treeRowActionsLock';
import { SYS_MENU_PERMS } from '@/views/system/menu/constants/permissions';
import useMenuMoreAction from '@/views/system/menu/hooks/actions/useMenuMoreAction';
import useMenuTableAction from '@/views/system/menu/hooks/actions/useMenuTableAction';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import { inject, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuRowActions',
});

/** 菜单行操作按钮 props */
interface MenuRowActionsProps {
  /** 菜单行数据 */
  row: SysMenuRow;
  /** 树视图展示「新增下级」 */
  showAddChild?: boolean;
  /** 下拉菜单是否 Teleport 到 body */
  dropdownTeleported?: boolean;
}

const props = withDefaults(defineProps<MenuRowActionsProps>(), {
  showAddChild: false,
  dropdownTeleported: true,
});

const { t } = useI18n();
const { fetchTableData, fetchTreeData, refresh, viewMode, selectedRows } = useMenuPageState();
const { openDetailDialog, openEditDialog, openCreateDialog, deleteBatchRows } = useMenuTableAction({
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
});
const { openAssignRoleDrawer } = useMenuMoreAction({
  fetchTableData,
  fetchTreeData,
  refresh,
});

const treeRowActionsLock = inject(treeRowActionsLockKey, null);

/**
 * 按下「更多」前锁定行，避免 visible-change 之前 hover 卸载
 */
function lockRowForDropdown() {
  treeRowActionsLock?.lock(props.row.id);
}

/**
 * 下拉展开期间锁定树行操作区，关闭后解除
 * @param visible 下拉是否可见
 */
function handleDropdownVisibleChange(visible: boolean) {
  if (!treeRowActionsLock) {
    return;
  }
  const key = props.row.id;
  if (visible) {
    treeRowActionsLock.lock(key);
    return;
  }
  treeRowActionsLock.unlock(key);
}

onUnmounted(() => {
  treeRowActionsLock?.unlock(props.row.id);
});
</script>

<template>
  <div class="menu-row-actions flex flex-wrap items-center gap-x-1">
    <!-- 查看 -->
    <el-button v-perms="SYS_MENU_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（树视图） -->
    <el-button
      v-if="showAddChild && row.status"
      v-perms="SYS_MENU_PERMS.CREATE"
      link
      type="primary"
      @click="openCreateDialog(row)"
    >
      {{ t('sysMenu.action.addChild') }}
    </el-button>

    <!-- 编辑 -->
    <el-button v-perms="SYS_MENU_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <!-- 删除 -->
    <el-button v-perms="SYS_MENU_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <!-- 更多 -->
    <Perms :value="SYS_MENU_PERMS.UPDATE">
      <el-dropdown
        :teleported="dropdownTeleported"
        trigger="click"
        @click.stop
        @visible-change="handleDropdownVisibleChange"
      >
        <el-button class="ml-2!" link type="primary" @pointerdown.stop="lockRowForDropdown">
          {{ t('buttons.actionMore') }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openAssignRoleDrawer(row)">
              {{ t('assign.role') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </Perms>
  </div>
</template>
