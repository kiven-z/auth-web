<script lang="ts" setup>
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { useChangePasswordAction } from '@/components/business/ChangePasswordDialog';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import {
  SYS_USER_DEPT_PERMS,
  SYS_USER_PERMS,
  SYS_USER_POST_PERMS,
  SYS_USER_ROLE_PERMS,
} from '@/views/system/user/constants/permissions';
import { USER_ACCOUNT_STATUS, USER_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-account-status';
import useUserAdvanceAction from '@/views/system/user/hooks/actions/useUserAdvanceAction';
import useUserMoreAction from '@/views/system/user/hooks/actions/useUserMoreAction';
import useUserTableAction from '@/views/system/user/hooks/actions/useUserTableAction';
import useUserTableColumns from '@/views/system/user/hooks/columns/useUserTableColumns';
import useUserPageState from '@/views/system/user/hooks/useUserPageState';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserTablePanel',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useUserTableColumns();
const searchFormRef = ref<FormInstance>();

const { tableState, fetchUserTable, resetUserSearch } = useUserPageState();
const { loading, searchForm, selectedRows, pagination } = tableState;

const { openCreateDialog, openUserDetailDialog, openEditDialog, batchUpdateStatus } = useUserTableAction({
  fetchTableData: fetchUserTable,
  selectedRows,
});

const { exporting, openExportDialog, openImportDialog, deleteBatchRows, batchKickAll, batchRefreshAuth } =
  useUserAdvanceAction({
    fetchTableData: fetchUserTable,
    selectedRows,
    searchForm,
    pagination,
  });

const {
  openAssignDeptDrawer,
  openAssignPostDrawer,
  openAssignRoleDrawer,
  openAdminUpdateAvatarDialog,
  openViewSessionsDialog,
  kickAllForUser,
  refreshUserAuth,
} = useUserMoreAction({ fetchTableData: fetchUserTable });

// 修改密码
const { openAdminResetPasswordDialog } = useChangePasswordAction();
const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

const hasSelection = computed(() => selectedRows.value.length > 0);
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 用户名 -->
      <el-form-item :label="t('users.field.username')" prop="username">
        <el-input
          v-model="searchForm.username"
          :placeholder="ph.input('users.field.username')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item :label="t('users.field.nickname')" prop="nickname">
        <el-input
          v-model="searchForm.nickname"
          :placeholder="ph.input('users.field.nickname')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item :label="t('users.field.phone')" prop="phone">
        <el-input v-model="searchForm.phone" :placeholder="ph.input('users.field.phone')" class="w-45!" clearable />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item :label="t('users.field.email')" prop="email">
        <el-input v-model="searchForm.email" :placeholder="ph.input('users.field.email')" class="w-45!" clearable />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <!-- 工号 -->
        <el-form-item v-show="searchExpanded" :label="t('relation.employeeNo')" prop="employeeNo">
          <el-input
            v-model="searchForm.employeeNo"
            :placeholder="ph.input('relation.employeeNo')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <!-- 状态 -->
        <el-form-item v-show="searchExpanded" :label="t('users.field.status')" prop="status">
          <el-select
            v-model="searchForm.status"
            :placeholder="ph.selectFilter('users.field.status')"
            class="w-45!"
            clearable
          >
            <el-option
              v-for="opt in USER_STATUS_FILTER_OPTIONS"
              :key="opt.value"
              :label="t(opt.labelKey)"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="SYS_USER_PERMS.QUERY" :loading="loading" type="primary" @click="fetchUserTable">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_USER_PERMS.QUERY" @click="resetUserSearch(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <!-- 高级搜索 -->
          <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
            {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="tableState" :title="t('routes.userManagement')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="SYS_USER_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>

          <!-- 修改状态 -->
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

          <!-- 高级功能 -->
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
        <!-- 查看 -->
        <el-button v-perms="SYS_USER_PERMS.QUERY" link type="primary" @click="openUserDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 修改 -->
        <el-button v-perms="SYS_USER_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <!-- 删除 -->
        <el-button v-perms="SYS_USER_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>

        <!-- 更多 -->
        <el-dropdown trigger="click">
          <el-button link type="primary" class="ml-2!">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <Perms :value="SYS_USER_ROLE_PERMS.UPDATE">
              <el-dropdown-item @click="openAssignRoleDrawer(row)">
                {{ t('assign.role') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SYS_USER_DEPT_PERMS.QUERY">
              <el-dropdown-item @click="openAssignDeptDrawer(row)">
                {{ t('assign.dept') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SYS_USER_POST_PERMS.QUERY">
              <el-dropdown-item @click="openAssignPostDrawer(row)">
                {{ t('assign.post') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SYS_USER_PERMS.UPDATE">
              <el-dropdown-item @click="openAdminUpdateAvatarDialog(row.id, row.username, row.avatar)">
                {{ t('users.avatar.update') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SYS_USER_PERMS.UPDATE">
              <el-dropdown-item @click="openAdminResetPasswordDialog(row.id, row.username)">
                {{ t('users.password.reset') }}
              </el-dropdown-item>
            </Perms>
            <!-- 查看会话 -->
            <Perms :value="SYS_USER_PERMS.VIEW_SESSIONS">
              <el-dropdown-item @click="openViewSessionsDialog(row)">
                {{ t('users.session.view') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SYS_USER_PERMS.KICK_ALL">
              <el-dropdown-item @click="kickAllForUser(row.id)">
                {{ t('users.kick.action') }}
              </el-dropdown-item>
            </Perms>
            <Perms :value="SYS_USER_PERMS.AUTH_REFRESH">
              <el-dropdown-item @click="refreshUserAuth(row)">
                {{ t('users.authRefresh.action') }}
              </el-dropdown-item>
            </Perms>
          </template>
        </el-dropdown>
      </template>
    </AuthPagedTable>
  </div>
</template>
