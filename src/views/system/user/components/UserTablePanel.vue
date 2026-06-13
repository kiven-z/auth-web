<script lang="ts" setup>
import type { SysUserPageRow } from '@/api/system/user';
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { selectUserinfo } from '@/components/business/UserProfile';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/composables/search/useCollapsibleSearchForm';
import { USER_ACCOUNT_STATUS, USER_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-account-status';
import useUserAdvanceAction from '@/views/system/user/hooks/actions/useUserAdvanceAction';
import useUserMoreAction from '@/views/system/user/hooks/actions/useUserMoreAction';
import useUserPageState from '@/views/system/user/hooks/useUserPageState';
import useUserTableAction from '@/views/system/user/hooks/actions/useUserTableAction';
import useUserTableColumns from '@/views/system/user/hooks/columns/useUserTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useChangePasswordAction } from '@/components/business/ChangePasswordDialog';

defineOptions({
  name: 'UserTablePanel',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useUserTableColumns();
const searchFormRef = ref<FormInstance>();

const { tableState, fetchUserTable, resetUserSearch } = useUserPageState();
const { loading, searchForm, selectedRows, pagination } = tableState;

const { openCreateDialog, openEditDialog, batchUpdateStatus } = useUserTableAction({
  fetchTableData: fetchUserTable,
  selectedRows,
});

const { exporting, openExportDialog, deleteBatchRows, batchKickAll, batchRefreshAuth } = useUserAdvanceAction({
  fetchTableData: fetchUserTable,
  selectedRows,
  searchForm,
  pagination,
});

const {
  openAssignDeptDrawer,
  openAssignPostDrawer,
  openAssignRoleDrawer,
  openViewSessionsDialog,
  kickAllForUser,
  refreshUserAuth,
} = useUserMoreAction({ fetchTableData: fetchUserTable });

// 修改密码
const { openAdminResetPasswordDialog } = useChangePasswordAction();
const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

const hasSelection = computed(() => selectedRows.value.length > 0);

/**
 * 打开用户档案弹窗
 * @param row 用户行
 */
const handleView = (row: SysUserPageRow) => {
  selectUserinfo(row.id, row.username);
};
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
          <el-button :loading="loading" type="primary" @click="fetchUserTable">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="resetUserSearch(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
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
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <!-- 修改状态 -->
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

          <!-- 高级功能 -->
          <el-dropdown trigger="click">
            <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
            <template #dropdown>
              <el-dropdown-item disabled>从 Excel 导入（敬请期待）</el-dropdown-item>
              <el-dropdown-item :disabled="exporting" @click="openExportDialog">
                {{ t('buttons.exportExcel') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="batchKickAll()">
                {{ t('users.kick.batchAction') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="batchRefreshAuth()">
                {{ t('users.authRefresh.batchAction') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center gap-x-1">
          <!-- 查看 -->
          <el-button link type="primary" @click="handleView(row)">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改 -->
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
          <!-- 删除 -->
          <el-button link type="danger" @click="deleteBatchRows([row.id])">{{ t('buttons.actionDelete') }}</el-button>

          <!-- 更多 -->
          <el-dropdown trigger="click">
            <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
            <template #dropdown>
              <el-dropdown-item @click="openAssignRoleDrawer(row)">
                {{ t('assign.role') }}
              </el-dropdown-item>
              <el-dropdown-item @click="openAssignDeptDrawer(row)">
                {{ t('assign.dept') }}
              </el-dropdown-item>
              <el-dropdown-item @click="openAssignPostDrawer(row)">
                {{ t('assign.post') }}
              </el-dropdown-item>
              <el-dropdown-item @click="openAdminResetPasswordDialog(row.id, row.username)">
                {{ t('users.password.reset') }}
              </el-dropdown-item>
              <!-- 查看会话 -->
              <el-dropdown-item @click="openViewSessionsDialog(row)">
                {{ t('users.session.view') }}
              </el-dropdown-item>
              <el-dropdown-item @click="kickAllForUser(row.id)">
                {{ t('users.kick.action') }}
              </el-dropdown-item>
              <el-dropdown-item @click="refreshUserAuth(row)">
                {{ t('users.authRefresh.action') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
