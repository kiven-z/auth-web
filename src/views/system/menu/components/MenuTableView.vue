<script lang="ts" setup>
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { SYS_MENU_PERMS } from '@/views/system/menu/constants/permissions';
import { MENU_TYPE_OPTIONS } from '@/views/system/menu/constants/menu-type';
import useMenuMoreAction from '@/views/system/menu/hooks/actions/useMenuMoreAction';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import useMenuTableAction from '@/views/system/menu/hooks/actions/useMenuTableAction';
import useMenuTableColumns from '@/views/system/menu/hooks/useMenuTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/shared/constants/boolean-status';

defineOptions({
  name: 'MenuTableView',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
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

const { openAssignRoleDrawer } = useMenuMoreAction({
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
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('sysMenu.routeName')" prop="name">
        <el-input v-model="searchForm.name" :placeholder="ph.input('sysMenu.routeName')" class="w-45!" clearable />
      </el-form-item>

      <el-form-item :label="t('sysMenu.menuTitle')" prop="title">
        <el-input v-model="searchForm.title" :placeholder="ph.input('sysMenu.menuTitle')" class="w-45!" clearable />
      </el-form-item>

      <el-form-item :label="t('sysMenu.menuType')" prop="menuType">
        <el-select
          v-model="searchForm.menuType"
          :placeholder="ph.selectFilter('sysMenu.menuType')"
          class="w-40!"
          clearable
        >
          <el-option v-for="opt in MENU_TYPE_OPTIONS" :key="opt.value" :label="t(opt.labelKey)" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('sysMenu.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="ph.selectFilter('sysMenu.status')" class="w-35!" clearable>
          <el-option
            v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('sysMenu.component')" prop="component">
        <el-input v-model="searchForm.component" :placeholder="ph.input('sysMenu.component')" class="w-45!" clearable />
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
      :columns="tableColumns"
      :state="menuPageState"
      :title="t('sysMenu.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <Perms :value="SYS_MENU_PERMS.UPDATE">
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
          </Perms>

          <Perms :value="SYS_MENU_PERMS.DELETE">
            <el-dropdown trigger="click">
              <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
              <template #dropdown>
                <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                  {{ t('buttons.actionBatchDelete') }}
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </Perms>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_MENU_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_MENU_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_MENU_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <Perms :value="SYS_MENU_PERMS.UPDATE">
          <el-dropdown trigger="click">
            <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openAssignRoleDrawer(row)">
                  {{ t('assign.role') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </Perms>
      </template>
    </AuthPagedTable>
  </div>
</template>
