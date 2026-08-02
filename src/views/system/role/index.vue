<script lang="ts" setup>
import { getRolePage } from '@/api/system/role/role';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_ROLE_PERMS } from '@/views/system/role/constants/permissions';
import useRoleAdvanceAction from '@/views/system/role/hooks/actions/useRoleAdvanceAction';
import useRoleMoreAction from '@/views/system/role/hooks/actions/useRoleMoreAction';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import useRoleTableAction from '@/views/system/role/hooks/actions/useRoleTableAction';
import useRoleTableColumns from '@/views/system/role/hooks/useRoleTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemRole',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();

const { columns } = useRoleTableColumns();

const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: undefined,
  }),
});

const { loading, searchForm, pagination, selectedRows, fetchTableData, resetQuery } = roleState;

const { exporting, openExportDialog, openImportDialog } = useRoleAdvanceAction({
  searchForm,
  pagination,
  fetchTableData,
});

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow, batchUpdateStatus } = useRoleTableAction({
  fetchTableData,
});

const { openAssignPermissionDrawer, openDataScopeDialog, openGrantSubjectsDrawer } = useRoleMoreAction();

const hasSelection = computed(() => selectedRows.value.length > 0);

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
      <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="ph.input('roles.field.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="ph.input('roles.field.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('roles.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button v-perms="SYS_ROLE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="SYS_ROLE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="roleState" :title="t('roles.title.page')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="SYS_ROLE_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <Perms :value="SYS_ROLE_PERMS.UPDATE">
            <el-dropdown trigger="click">
              <el-button :disabled="!hasSelection" type="warning">
                {{ t('buttons.actionBatchStatus') }}
              </el-button>
              <template #dropdown>
                <el-dropdown-item :disabled="!hasSelection" @click="batchUpdateStatus(selectedRows, true)">
                  {{ t('buttons.actionBatchEnable') }}
                </el-dropdown-item>
                <el-dropdown-item :disabled="!hasSelection" @click="batchUpdateStatus(selectedRows, false)">
                  {{ t('buttons.actionBatchDisable') }}
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </Perms>

          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>
            <template #dropdown>
              <Perms :value="SYS_ROLE_PERMS.IMPORT">
                <el-dropdown-item @click="openImportDialog">
                  {{ t('buttons.importExcel') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SYS_ROLE_PERMS.EXPORT">
                <el-dropdown-item :disabled="exporting" @click="openExportDialog">
                  {{ t('buttons.exportExcel') }}
                </el-dropdown-item>
              </Perms>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_ROLE_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_ROLE_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_ROLE_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
          {{ t('buttons.actionDelete') }}
        </el-button>

        <el-dropdown trigger="click">
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <Perms :value="SYS_ROLE_PERMS.UPDATE">
                <el-dropdown-item @click="openAssignPermissionDrawer(row)">
                  {{ t('roles.assign.permission') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SYS_ROLE_PERMS.UPDATE">
                <el-dropdown-item @click="openDataScopeDialog(row)">
                  {{ t('roles.menu.dataScope') }}
                </el-dropdown-item>
              </Perms>
              <Perms :value="SYS_ROLE_PERMS.UPDATE">
                <el-dropdown-item @click="openGrantSubjectsDrawer(row)">
                  {{ t('roles.menu.grantSubjects') }}
                </el-dropdown-item>
              </Perms>
              <el-dropdown-item>{{ t('roles.menu.impactAnalysis') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>
