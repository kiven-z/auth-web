<script lang="ts" setup>
import { treeRowActionsLockKey } from '@/components/business/AuthElTreePanel/src/treeRowActionsLock';
import { SYS_DEPT_PERMS } from '@/views/system/dept/constants/permissions';
import type { SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import { inject, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptRowActions',
});

/** 部门行操作按钮 props */
interface DeptRowActionsProps {
  /** 部门行数据 */
  row: SysDeptRow;
  /** 树视图展示「新增下级」 */
  showAddChild?: boolean;
  /** 下拉菜单是否 Teleport 到 body */
  dropdownTeleported?: boolean;
  openDetailDialog: (row: SysDeptRow) => void;
  openEditDialog: (row: SysDeptRow) => void;
  openCreateDialog?: (row: SysDeptRow) => void;
  deleteBatchRows: (ids?: unknown) => void;
  openAssignRoleDrawer: (row: SysDeptRow) => void;
}

const props = withDefaults(defineProps<DeptRowActionsProps>(), {
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
  <div class="dept-row-actions flex flex-wrap items-center gap-x-1">
    <!-- 查看 -->
    <el-button v-perms="SYS_DEPT_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（树视图） -->
    <el-button
      v-if="showAddChild && row.status"
      v-perms="SYS_DEPT_PERMS.CREATE"
      link
      type="primary"
      @click="openCreateDialog(row)"
    >
      {{ t('dept.action.addChild') }}
    </el-button>

    <!-- 编辑 -->
    <el-button v-perms="SYS_DEPT_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <!-- 删除 -->
    <el-button v-perms="SYS_DEPT_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <!-- 更多 -->
    <el-dropdown
      v-perms="SYS_DEPT_PERMS.UPDATE"
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
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
