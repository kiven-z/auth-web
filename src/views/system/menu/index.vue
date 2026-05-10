<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { menuStatusFilterOptions, menuTypeFilterOptions } from '@/views/system/menu/constants/menu-search-options';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableColumns from '@/views/system/menu/hooks/useMenuTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemMenu',
});

const { t } = useI18n();
const { tableColumns, treeColumns } = useMenuTableColumns();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);
const treeTableRef = ref<{ toggleRowExpansion: (row: unknown, expanded: boolean) => void } | null>(null);

/**
 * 视图模式：table = 表格视图，tree = 树形视图
 */
const viewMode = ref<'table' | 'tree'>('table');

const segmentedOptions = [
  // 表格视图
  { label: t('sysMenu.viewTableTitle'), value: 'table' },
  // 表格树形
  { label: '表格树形', value: 'tree' },
  // 树形视图
  { label: t('sysMenu.viewTreeTitle'), value: 'tree' },
];

const {
  loading,
  selectedRows,
  tableData,
  searchForm,
  pagination,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
  handleSelectionChange,
  treeData,
  fetchTreeData,
} = useMenuPageState();

/**
 * 切换视图时加载对应数据
 */
watch(viewMode, (mode) => {
  if (mode === 'tree') {
    fetchTreeData();
  } else {
    fetchTableData();
  }
});

/**
 * 树形视图：展开全部
 */
const expandAllTree = () => {
  if (!treeTableRef.value) return;
  treeData.value.forEach((node) => {
    treeTableRef.value!.toggleRowExpansion(node, true);
  });
};

/**
 * 树形视图：折叠全部
 */
const collapseAllTree = () => {
  if (!treeTableRef.value) return;
  treeData.value.forEach((node) => {
    treeTableRef.value!.toggleRowExpansion(node, false);
  });
};

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <!-- 视图切换 -->
    <div class="flex justify-center pt-3 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <!-- ══════════════════ 表格视图 ══════════════════ -->
    <template v-if="viewMode === 'table'">
      <!-- 搜索栏 -->
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
      >
        <!-- 路由名称 -->
        <el-form-item :label="t('sysMenu.routeName')" prop="name">
          <el-input
            v-model="searchForm.name"
            :placeholder="t('sysMenu.placeholder.routeName')"
            class="w-[200px]!"
            clearable
          />
        </el-form-item>

        <!-- 菜单标题 -->
        <el-form-item :label="t('sysMenu.menuTitle')" prop="title">
          <el-input
            v-model="searchForm.title"
            :placeholder="t('sysMenu.placeholder.menuTitle')"
            class="w-[200px]!"
            clearable
          />
        </el-form-item>

        <!-- 菜单类型 -->
        <el-form-item :label="t('sysMenu.menuType')" prop="menuType">
          <el-select
            v-model="searchForm.menuType"
            :placeholder="t('sysMenu.placeholder.menuType')"
            class="w-[160px]!"
            clearable
          >
            <el-option
              v-for="opt in menuTypeFilterOptions"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item :label="t('sysMenu.status')" prop="status">
          <el-select
            v-model="searchForm.status"
            :placeholder="t('sysMenu.placeholder.status')"
            class="w-[140px]!"
            clearable
          >
            <el-option
              v-for="opt in menuStatusFilterOptions"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <!-- 组件路径 -->
        <el-form-item :label="t('sysMenu.component')" prop="component">
          <el-input
            v-model="searchForm.component"
            :placeholder="t('sysMenu.placeholder.component')"
            class="w-[200px]!"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 工具栏 + 表格 -->
      <TableBar
        :columns="tableColumns"
        :title="t('sysMenu.tableTitle')"
        @fullscreen="tableRef?.setAdaptive()"
        @refresh="fetchTableData"
      >
        <template #buttons>
          <el-button-group type="primary">
            <!-- 新增 -->
            <el-button type="primary">{{ t('buttons.actionAdd') }}</el-button>

            <!-- 修改状态 -->
            <el-dropdown trigger="click">
              <el-button :disabled="selectedRows.length <= 0" type="warning">
                {{ t('buttons.actionBatchStatus') }}
              </el-button>
              <template #dropdown>
                <el-dropdown-item>{{ t('buttons.actionBatchEnable') }}</el-dropdown-item>
                <el-dropdown-item>{{ t('buttons.actionBatchDisable') }}</el-dropdown-item>
              </template>
            </el-dropdown>

            <!-- 高级功能 -->
            <el-dropdown trigger="click">
              <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
              <template #dropdown>
                <el-dropdown-item :disabled="selectedRows.length <= 0">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </el-button-group>
        </template>

        <template #default="{ size, dynamicColumns }">
          <AuthDataTable
            ref="tableRef"
            :adaptive-config="{ offsetBottom: 96 }"
            :columns="dynamicColumns"
            :data="tableData"
            :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
            :loading="loading"
            :pagination="pagination"
            :size="size"
            adaptive
            align-whole="center"
            border
            highlight-current-row
            row-key="id"
            show-overflow-tooltip
            table-layout="auto"
            @page-size-change="handlePageSizeChange"
            @page-current-change="handlePageCurrentChange"
            @selection-change="handleSelectionChange"
          >
            <template #actions="{ row }">
              <div class="flex justify-center flex-wrap gap-x-1">
                <el-button link type="primary">{{ t('buttons.actionView') }}</el-button>
                <el-button link type="primary">{{ t('buttons.actionEdit') }}</el-button>
                <el-button link type="danger">{{ t('buttons.actionDelete') }}</el-button>
                <el-dropdown class="ml-1" trigger="click">
                  <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>{{ t('sysMenu.assignRole') }}</el-dropdown-item>
                      <el-dropdown-item>{{ t('sysMenu.assignPermission') }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </AuthDataTable>
        </template>
      </TableBar>
    </template>

    <!-- ══════════════════ 树形视图 ══════════════════ -->
    <template v-else>
      <TableBar
        :columns="treeColumns"
        :title="t('sysMenu.tableTitle')"
        @fullscreen="tableRef?.setAdaptive()"
        @refresh="fetchTreeData"
      >
        <template #buttons>
          <el-button-group type="primary">
            <!-- 新增 -->
            <el-button type="primary">{{ t('buttons.actionAdd') }}</el-button>

            <!-- 展开/折叠 -->
            <el-button type="info" @click="expandAllTree">{{ t('sysMenu.expandAll') }}</el-button>
            <el-button type="info" @click="collapseAllTree">{{ t('sysMenu.collapseAll') }}</el-button>
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
              :key="col.prop ?? col.label"
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
                <div class="flex justify-center flex-wrap gap-x-1">
                  <el-button link type="primary">{{ t('buttons.actionView') }}</el-button>
                  <el-button link type="primary">{{ t('buttons.actionEdit') }}</el-button>
                  <el-button link type="danger">{{ t('buttons.actionDelete') }}</el-button>
                  <el-dropdown class="ml-1" trigger="click">
                    <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>{{ t('sysMenu.assignRole') }}</el-dropdown-item>
                        <el-dropdown-item>{{ t('sysMenu.assignPermission') }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
              <template v-else-if="col.formatter" #default="{ row }">
                <!-- 用箭头函数包裹，使 Vue 3 将其识别为函数式组件来渲染 VNode -->
                <component :is="() => col.formatter!(row, {}, row[col.prop ?? ''], 0)" />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </TableBar>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
