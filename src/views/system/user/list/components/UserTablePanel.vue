<script lang="ts" setup>
import PagedTable from '@/components/table/PagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { SYS_USER_PERMS } from '@/views/system/user/constants/permissions';
import { USER_ACCOUNT_STATUS } from '@/views/system/user/constants/user-enums';
import useUserOptions from '@/views/system/user/hooks/options/useUserOptions';
import { useOpenUserWorkstation } from '@/views/system/user/hooks/useOpenUserWorkstation';
import useUserAdvanceAction from '@/views/system/user/list/hooks/actions/useUserAdvanceAction';
import useUserTableAction from '@/views/system/user/list/hooks/actions/useUserTableAction';
import useUserTableColumns from '@/views/system/user/list/hooks/columns/useUserTableColumns';
import useUserPageState from '@/views/system/user/list/hooks/useUserPageState';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserTablePanel',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusFilterOptions: userStatusOptions } = useUserOptions();
const { columns } = useUserTableColumns();
const searchFormRef = ref<FormInstance>();

const { tableState, fetchUserTable, resetUserSearch } = useUserPageState();
const { loading, searchForm, selectedRows, pagination } = tableState;

const { openCreateDialog, batchUpdateStatus } = useUserTableAction({
  fetchTableData: fetchUserTable,
});

const { exporting, openExportDialog, openImportDialog, deleteBatchRows, batchKickAll, batchRefreshAuth } =
  useUserAdvanceAction({
    fetchTableData: fetchUserTable,
    selectedRows,
    searchForm,
    pagination,
  });

const { openUserWorkstation } = useOpenUserWorkstation();
const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

const hasSelection = computed(() => selectedRows.value.length > 0);
</script>

<template>
  <div class="user-table-panel">
    <div class="user-table-panel__search">
      <el-form
        ref="searchFormRef"
        v-enter-submit="fetchUserTable"
        :model="searchForm"
        class="user-table-panel__form bg-auth-container overflow-auto pl-8 pt-3"
        inline
      >
        <el-form-item :label="t('users.field.username')" prop="username">
          <el-input
            v-model="searchForm.username"
            :placeholder="ph.input('users.field.username')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('users.field.nickname')" prop="nickname">
          <el-input
            v-model="searchForm.nickname"
            :placeholder="ph.input('users.field.nickname')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('users.field.phone')" prop="phone">
          <el-input v-model="searchForm.phone" :placeholder="ph.input('users.field.phone')" class="w-45!" clearable />
        </el-form-item>
        <el-form-item :label="t('users.field.email')" prop="email">
          <el-input v-model="searchForm.email" :placeholder="ph.input('users.field.email')" class="w-45!" clearable />
        </el-form-item>
        <template v-if="showAdvancedSearchToggle">
          <el-form-item v-show="searchExpanded" :label="t('relation.employeeNo')" prop="employeeNo">
            <el-input
              v-model="searchForm.employeeNo"
              :placeholder="ph.input('relation.employeeNo')"
              class="w-45!"
              clearable
            />
          </el-form-item>
          <el-form-item v-show="searchExpanded" :label="t('users.field.status')" prop="status">
            <el-select
              v-model="searchForm.status"
              :placeholder="ph.selectFilter('users.field.status')"
              class="w-45!"
              clearable
            >
              <el-option v-for="opt in userStatusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button-group>
            <el-button v-perms="SYS_USER_PERMS.QUERY" :loading="loading" type="primary" @click="fetchUserTable">
              {{ t('buttons.actionSearch') }}
            </el-button>
            <el-button v-perms="SYS_USER_PERMS.QUERY" @click="resetUserSearch(searchFormRef)">
              {{ t('buttons.actionReset') }}
            </el-button>
            <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
              {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="user-table-panel__table">
      <PagedTable :columns="columns" :state="tableState" :title="t('routes.userManagement')" adaptive="fill">
        <template #buttons>
          <el-button-group type="primary">
            <el-button v-perms="SYS_USER_PERMS.CREATE" type="primary" @click="openCreateDialog">
              {{ t('buttons.actionAdd') }}
            </el-button>

            <Perms :value="SYS_USER_PERMS.UPDATE">
              <el-dropdown trigger="click">
                <el-button :disabled="!hasSelection" type="warning">
                  {{ t('buttons.actionBatchStatus') }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item
                    :disabled="!hasSelection"
                    @click="batchUpdateStatus(selectedRows, USER_ACCOUNT_STATUS.normal)"
                  >
                    {{ t('buttons.actionBatchEnable') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    :disabled="!hasSelection"
                    @click="batchUpdateStatus(selectedRows, USER_ACCOUNT_STATUS.locked)"
                  >
                    {{ t('buttons.actionBatchLock') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    :disabled="!hasSelection"
                    @click="batchUpdateStatus(selectedRows, USER_ACCOUNT_STATUS.disabled)"
                  >
                    {{ t('buttons.actionBatchDisable') }}
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </Perms>

            <el-dropdown trigger="click">
              <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
              <template #dropdown>
                <Perms :value="SYS_USER_PERMS.IMPORT">
                  <el-dropdown-item @click="openImportDialog()">
                    {{ t('buttons.importExcel') }}
                  </el-dropdown-item>
                </Perms>
                <Perms :value="SYS_USER_PERMS.EXPORT">
                  <el-dropdown-item :disabled="exporting" @click="openExportDialog">
                    {{ t('buttons.exportExcel') }}
                  </el-dropdown-item>
                </Perms>
                <Perms :value="SYS_USER_PERMS.DELETE">
                  <el-dropdown-item :disabled="!hasSelection" @click="deleteBatchRows()">
                    {{ t('buttons.actionBatchDelete') }}
                  </el-dropdown-item>
                </Perms>
                <Perms :value="SYS_USER_PERMS.KICK_ALL">
                  <el-dropdown-item :disabled="!hasSelection" @click="batchKickAll()">
                    {{ t('users.kick.batchAction') }}
                  </el-dropdown-item>
                </Perms>
                <Perms :value="SYS_USER_PERMS.AUTH_REFRESH">
                  <el-dropdown-item :disabled="!hasSelection" @click="batchRefreshAuth()">
                    {{ t('users.authRefresh.batchAction') }}
                  </el-dropdown-item>
                </Perms>
              </template>
            </el-dropdown>
          </el-button-group>
        </template>

        <template #actions="{ row }">
          <el-button v-perms="SYS_USER_PERMS.QUERY" link type="primary" @click="openUserWorkstation(row.id)">
            {{ t('users.workstation.open') }}
          </el-button>
        </template>
      </PagedTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-table-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__search {
    flex-shrink: 0;
  }

  &__form {
    width: 100%;
  }

  &__table {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
