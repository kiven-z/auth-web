<script lang="ts" setup>
import ListTable from '@/components/table/ListTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import MenuRowActions from '@/features/system/menu/components/MenuRowActions.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import useMenuTableAction from '@/features/system/menu/hooks/actions/useMenuTableAction';
import useMenuTableColumns from '@/features/system/menu/hooks/columns/useMenuTableColumns';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/useMenuTypeOptions';
import useMenuPageState from '@/features/system/menu/hooks/useMenuPageState';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
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

const noSelection = computed(() => selectedRows.value.length <= 0);

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
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
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
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="tableColumns" :state="menuPageState" :title="t('sysMenu.tableTitle')">
      <template #buttons>
        <el-button v-auth="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchEnable'),
              permission: SYS_MENU_PERMS.UPDATE,
              onClick: () => batchUpdateStatus(selectedRows, true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: SYS_MENU_PERMS.UPDATE,
              onClick: () => batchUpdateStatus(selectedRows, false),
            },
          ]"
        >
          <el-button :disabled="selectedRows.length <= 0" type="warning">
            {{ t('buttons.actionBatchStatus') }}
          </el-button>
        </AuthDropdown>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: SYS_MENU_PERMS.DELETE,
              disabled: noSelection,
              onClick: () => deleteBatchRows(),
            },
          ]"
        >
          <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <MenuRowActions :row="row" />
      </template>
    </ListTable>
  </div>
</template>
