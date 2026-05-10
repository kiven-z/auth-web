<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import type { SysMenuTreeNode } from '@/views/system/menu/utils/tree-keys';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuTableTreeView',
});

defineProps<{
  columns: TableColumnList;
  loading: boolean;
  treeData: SysMenuTreeNode[];
  fetchTreeData: () => Promise<void>;
  onAdd: () => void;
  onView: (row: SysMenuRow) => void;
  onEdit: (row: SysMenuRow) => void;
  onDelete: (row: SysMenuRow) => void;
  onAssignRole: (row: SysMenuRow) => void;
  onAssignPermission: (row: SysMenuRow) => void;
}>();

const { t } = useI18n();
const treeTableRef = ref<{ toggleRowExpansion: (row: unknown, expanded: boolean) => void } | null>(null);

/**
 * 展开全部行
 */
const expandAllTree = (data: SysMenuTreeNode[]) => {
  if (!treeTableRef.value) return;
  data.forEach((node) => {
    treeTableRef.value!.toggleRowExpansion(node, true);
    if (node.children?.length) {
      expandAllTree(node.children);
    }
  });
};

/**
 * 折叠全部行
 */
const collapseAllTree = (data: SysMenuTreeNode[]) => {
  if (!treeTableRef.value) return;
  data.forEach((node) => {
    treeTableRef.value!.toggleRowExpansion(node, false);
    if (node.children?.length) {
      collapseAllTree(node.children);
    }
  });
};
</script>

<template>
  <TableBar :columns="columns" :title="t('sysMenu.tableTitle')" @refresh="fetchTreeData">
    <template #buttons>
      <el-button-group type="primary">
        <el-button type="primary" @click="onAdd">{{ t('buttons.actionAdd') }}</el-button>
        <el-button type="info" @click="expandAllTree(treeData)">{{ t('sysMenu.expandAll') }}</el-button>
        <el-button type="info" @click="collapseAllTree(treeData)">{{ t('sysMenu.collapseAll') }}</el-button>
      </el-button-group>
    </template>

    <template #default="{ size, dynamicColumns }">
      <el-table
        ref="treeTableRef"
        v-loading="loading"
        :data="treeData"
        :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
        :size="size"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        default-expand-all
        highlight-current-row
        row-key="id"
        style="width: 100%"
        table-layout="auto"
      >
        <el-table-column
          v-for="col in dynamicColumns"
          :key="String(col.prop ?? col.label)"
          :fixed="col.fixed"
          :label="col.label"
          :min-width="col.minWidth"
          :prop="col.prop"
          :show-overflow-tooltip="col.showOverflowTooltip ?? true"
          :sortable="col.sortable"
          :width="col.width"
          align="center"
        >
          <template v-if="col.slot === 'actions'" #default="{ row }">
            <div class="flex justify-center flex-wrap gap-x-1" @click.stop>
              <el-button link type="primary" @click="onView(row)">{{ t('buttons.actionView') }}</el-button>
              <el-button link type="primary" @click="onEdit(row)">{{ t('buttons.actionEdit') }}</el-button>
              <el-button link type="danger" @click="onDelete(row)">{{ t('buttons.actionDelete') }}</el-button>
              <el-dropdown class="ml-1" trigger="click" @click.stop>
                <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="onAssignRole(row)">{{ t('sysMenu.assignRole') }}</el-dropdown-item>
                    <el-dropdown-item @click="onAssignPermission(row)">
                      {{ t('sysMenu.assignPermission') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <template v-else-if="col.formatter" #default="{ row }">
            <component :is="() => col.formatter!(row, {}, row[col.prop ?? ''], 0)" />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </TableBar>
</template>
