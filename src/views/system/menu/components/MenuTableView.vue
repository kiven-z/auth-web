<script lang="ts" setup>
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import MenuRowActions from '@/views/system/menu/components/MenuRowActions.vue';
import { SYS_MENU_PERMS } from '@/views/system/menu/constants/permissions';
import useMenuTableAction from '@/views/system/menu/hooks/actions/useMenuTableAction';
import useMenuTableColumns from '@/views/system/menu/hooks/columns/useMenuTableColumns';
import { useMenuTypeOptions } from '@/views/system/menu/hooks/options/useMenuTypeOptions';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuTableView',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const menuTypeOptions = useMenuTypeOptions();
const searchFormRef = ref<FormInstance>();

const { tableColumns } = useMenuTableColumns();

const menuPageState = useMenuPageState();
const { loading, selectedRows, searchForm, fetchTableData, fetchTreeData, resetQuery, refresh, viewMode } =
  menuPageState;

const { openCreateDialog, deleteBatchRows, batchUpdateStatus } = useMenuTableAction({
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
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
          <el-option v-for="opt in menuTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('sysMenu.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="ph.selectFilter('sysMenu.status')" class="w-35!" clearable>
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('sysMenu.component')" prop="component">
        <el-input v-model="searchForm.component" :placeholder="ph.input('sysMenu.component')" class="w-45!" clearable />
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
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
              <el-button type="warning" :disabled="selectedRows.length <= 0">
                {{ t('buttons.actionBatchStatus') }}
              </el-button>
              <template #dropdown>
                <el-dropdown-item @click="batchUpdateStatus(selectedRows, true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
                <el-dropdown-item @click="batchUpdateStatus(selectedRows, false)">
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
        <MenuRowActions :row="row" />
      </template>
    </AuthPagedTable>
  </div>
</template>
