<script lang="ts" setup>
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { menuTypeFilterOptions } from '@/views/system/menu/constants/menu-type';
import useMenuMoreAction from '@/views/system/menu/hooks/useMenuMoreAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/useMenuTableAction';
import useMenuTableColumns from '@/views/system/menu/hooks/useMenuTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/constants/boolean-status';

defineOptions({
  name: 'MenuTableView',
});

const { t } = useI18n();
const searchFormRef = ref<FormInstance>();

const { tableColumns } = useMenuTableColumns();

const menuPageState = useMenuPageState();
const { loading, selectedRows, searchForm, fetchTableData, fetchTreeData, resetQuery, refresh, viewMode } =
  menuPageState;

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows, batchUpdateStatus } = useMenuTableAction({
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

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <el-form-item :label="t('sysMenu.routeName')" prop="name">
        <el-input v-model="searchForm.name" :placeholder="t('sysMenu.placeholder.routeName')" class="w-45!" clearable />
      </el-form-item>

      <el-form-item :label="t('sysMenu.menuTitle')" prop="title">
        <el-input
          v-model="searchForm.title"
          :placeholder="t('sysMenu.placeholder.menuTitle')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('sysMenu.menuType')" prop="menuType">
        <el-select
          v-model="searchForm.menuType"
          :placeholder="t('sysMenu.placeholder.menuType')"
          class="w-40!"
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
        <el-select v-model="searchForm.status" :placeholder="t('sysMenu.placeholder.status')" class="w-35!" clearable>
          <el-option
            v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('sysMenu.component')" prop="component">
        <el-input
          v-model="searchForm.component"
          :placeholder="t('sysMenu.placeholder.component')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :adaptive-config="{ offsetBottom: 96 }"
      :columns="tableColumns"
      :state="menuPageState"
      :title="t('sysMenu.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <el-dropdown trigger="click">
            <el-button type="warning">
              {{ t('buttons.actionBatchStatus') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(selectedRows, true)">
                {{ t('buttons.actionBatchEnable') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(selectedRows, false)">
                {{ t('buttons.actionBatchDisable') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>

          <el-dropdown trigger="click">
            <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center flex-wrap gap-x-1">
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
          <el-button link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
          <el-dropdown class="ml-1" trigger="click">
            <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openAssignRoleDrawer(row)">
                  {{ t('sysMenu.assignRole') }}
                </el-dropdown-item>
                <el-dropdown-item @click="openAssignPermissionDrawer(row)">
                  {{ t('sysMenu.assignPermission') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
