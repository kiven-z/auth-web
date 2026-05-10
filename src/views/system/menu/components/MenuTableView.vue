<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { menuStatusFilterOptions, menuTypeFilterOptions } from '@/views/system/menu/constants/menu-search-options';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuTableView',
});

defineProps<{
  columns: TableColumnList;
  loading: boolean;
  tableData: SysMenuRow[];
  searchForm: {
    name?: string;
    title?: string;
    menuType?: number;
    status?: number;
    component?: string;
  };
  selectedRowIds: string[];
  fetchTableData: () => Promise<void>;
  resetQuery: (formRef?: FormInstance) => Promise<void>;
  handleSelectionChange: (value: SysMenuRow[]) => void;
  onAdd: () => void;
  onView: (row: SysMenuRow) => void;
  onEdit: (row: SysMenuRow) => void;
  onDelete: (row: SysMenuRow) => void;
  onAssignRole: (row: SysMenuRow) => void;
  onAssignPermission: (row: SysMenuRow) => void;
  onBatchEnable: () => void;
  onBatchDisable: () => void;
  onBatchDelete: () => void;
}>();

const { t } = useI18n();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

defineExpose({
  tableRef,
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
    >
      <el-form-item :label="t('sysMenu.routeName')" prop="name">
        <el-input
          v-model="searchForm.name"
          :placeholder="t('sysMenu.placeholder.routeName')"
          class="w-[200px]!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('sysMenu.menuTitle')" prop="title">
        <el-input
          v-model="searchForm.title"
          :placeholder="t('sysMenu.placeholder.menuTitle')"
          class="w-[200px]!"
          clearable
        />
      </el-form-item>

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

    <TableBar
      :columns="columns"
      :title="t('sysMenu.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button type="primary" @click="onAdd">{{ t('buttons.actionAdd') }}</el-button>

          <el-dropdown trigger="click">
            <el-button :disabled="selectedRowIds.length <= 0" type="warning">
              {{ t('buttons.actionBatchStatus') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item @click="onBatchEnable">{{ t('buttons.actionBatchEnable') }}</el-dropdown-item>
              <el-dropdown-item @click="onBatchDisable">{{ t('buttons.actionBatchDisable') }}</el-dropdown-item>
            </template>
          </el-dropdown>

          <el-dropdown trigger="click">
            <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="selectedRowIds.length <= 0" @click="onBatchDelete">
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
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          show-overflow-tooltip
          table-layout="auto"
          @selection-change="handleSelectionChange"
        >
          <template #actions="{ row }">
            <div class="flex justify-center flex-wrap gap-x-1">
              <el-button link type="primary" @click="onView(row)">{{ t('buttons.actionView') }}</el-button>
              <el-button link type="primary" @click="onEdit(row)">{{ t('buttons.actionEdit') }}</el-button>
              <el-button link type="danger" @click="onDelete(row)">{{ t('buttons.actionDelete') }}</el-button>
              <el-dropdown class="ml-1" trigger="click">
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
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>
