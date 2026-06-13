<script lang="ts" setup>
import type { SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
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

withDefaults(defineProps<DeptRowActionsProps>(), {
  showAddChild: false,
  dropdownTeleported: true,
});

const { t } = useI18n();
</script>

<template>
  <div class="dept-row-actions flex flex-wrap items-center gap-x-1">
    <!-- 查看 -->
    <el-button link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（树视图） -->
    <el-button v-if="showAddChild && row.status" link type="primary" @click="openCreateDialog(row)">
      {{ t('dept.action.addChild') }}
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
    <el-dropdown :teleported="dropdownTeleported" class="ml-1" trigger="click" @click.stop>
      <el-button class="el-dropdown-link" link type="primary">
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
