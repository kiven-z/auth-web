<script lang="ts" setup>
import type { SysDeptRow } from '@/views/system/dept/hooks/useDeptPageState';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptRowActions',
});

interface DeptRowActionsProps {
  // 部门行数据
  row: SysDeptRow;
  // 树节点内使用较小按钮
  compact?: boolean;
  // 树视图展示「新增下级」
  showAddChild?: boolean;
  openDetailDialog: (row: SysDeptRow) => void;
  openEditDialog: (row: SysDeptRow) => void;
  openCreateDialog?: (row: SysDeptRow) => void;
  deleteBatchRows: (ids?: unknown) => void;
  openAssignRoleDrawer: (row: SysDeptRow) => void;
}

const props = withDefaults(defineProps<DeptRowActionsProps>(), {
  compact: false,
  showAddChild: false,
});

const { t } = useI18n();

const buttonSize = props.compact ? ('small' as const) : undefined;
</script>

<template>
  <div class="dept-row-actions flex flex-wrap items-center gap-x-1" :class="{ 'dept-row-actions--compact': compact }">
    <!-- 查看 -->
    <el-button link :size="buttonSize" type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（树视图） -->
    <el-button
      v-if="showAddChild && openCreateDialog && row.status"
      link
      :size="buttonSize"
      type="primary"
      @click="openCreateDialog(row)"
    >
      {{ t('dept.addChild') }}
    </el-button>

    <!-- 编辑 -->
    <el-button link :size="buttonSize" type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <!-- 删除 -->
    <el-button link :size="buttonSize" type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <!-- 更多 -->
    <el-dropdown class="ml-1" trigger="click" @click.stop>
      <el-button class="el-dropdown-link" link :size="buttonSize" type="primary">
        {{ t('buttons.actionMore') }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="openAssignRoleDrawer(row)">
            {{ t('dept.assignRole') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
