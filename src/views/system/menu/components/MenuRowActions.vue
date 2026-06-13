<script lang="ts" setup>
import { treeRowActionsLockKey } from '@/components/business/AuthElTreePanel/src/treeRowActionsLock';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
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
  openDetailDialog: (row: SysMenuRow) => void;
  openEditDialog: (row: SysMenuRow) => void;
  openCreateDialog?: (row: SysMenuRow) => void;
  deleteBatchRows: (ids?: unknown) => void;
  openAssignRoleDrawer: (row: SysMenuRow) => void;
  openAssignPermissionDrawer: (row: SysMenuRow) => void;
}

const props = withDefaults(defineProps<MenuRowActionsProps>(), {
  showAddChild: false,
  dropdownTeleported: true,
});

const { t } = useI18n();
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
    <el-button link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（树视图） -->
    <el-button v-if="showAddChild && row.status" link type="primary" @click="openCreateDialog(row)">
      {{ t('sysMenu.action.addChild') }}
    </el-button>

    <!-- 编辑 -->
    <el-button link type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <!-- 删除 -->
    <el-button link type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <!-- 更多 -->
    <el-dropdown
      :teleported="dropdownTeleported"
      class="ml-1"
      trigger="click"
      @click.stop
      @visible-change="handleDropdownVisibleChange"
    >
      <el-button class="el-dropdown-link" link type="primary" @pointerdown.stop="lockRowForDropdown">
        {{ t('buttons.actionMore') }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="openAssignRoleDrawer(row)">
            {{ t('assign.role') }}
          </el-dropdown-item>
          <el-dropdown-item @click="openAssignPermissionDrawer(row)">
            {{ t('sysMenu.assignPermission') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
