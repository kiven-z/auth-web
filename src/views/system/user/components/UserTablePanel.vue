<script lang="ts" setup>
import type { SysUserPageRow } from '@/api/system/user';
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { selectUserinfo } from '@/components/business/UserProfile';
import { useCollapsibleSearchForm } from '@/composables/search/useCollapsibleSearchForm';
import { USER_ACCOUNT_STATUS, USER_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-account-status';
import useUserAuthRefreshAction from '@/views/system/user/hooks/actions/useUserAuthRefreshAction';
import useUserMoreAction from '@/views/system/user/hooks/actions/useUserMoreAction';
import useUserPageState from '@/views/system/user/hooks/useUserPageState';
import useUserSessionKickAction from '@/views/system/user/hooks/actions/useUserSessionKickAction';
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
const { columns } = useUserTableColumns();
const searchFormRef = ref<FormInstance>();

const { tableState, fetchUserTable, resetUserSearch } = useUserPageState();
const { loading, searchForm, selectedRows } = tableState;

const { openViewSessionsDialog, kickUserSessions, refreshUserAuth } = useUserMoreAction();
const { openAdminResetPasswordDialog } = useChangePasswordAction();
const { batchKickAll } = useUserSessionKickAction({ selectedRows });
const { batchRefreshAuth } = useUserAuthRefreshAction({ selectedRows });
const { openCreateDialog, openEditDialog, deleteBatchRows, batchUpdateStatus } = useUserTableAction({
  fetchTableData: fetchUserTable,
  selectedRows,
});
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
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 用户名 -->
      <el-form-item :label="t('users.username')" prop="username">
        <el-input v-model="searchForm.username" :placeholder="t('users.username')" class="w-45!" clearable />
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item :label="t('users.nickname')" prop="nickname">
        <el-input v-model="searchForm.nickname" :placeholder="t('users.nickname')" class="w-45!" clearable />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item :label="t('users.phone')" prop="phone">
        <el-input v-model="searchForm.phone" :placeholder="t('users.phone')" class="w-45!" clearable />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item :label="t('users.email')" prop="email">
        <el-input v-model="searchForm.email" :placeholder="t('users.email')" class="w-45!" clearable />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <!-- 工号 -->
        <el-form-item v-show="searchExpanded" :label="t('dept.employeeNo')" prop="employeeNo">
          <el-input v-model="searchForm.employeeNo" :placeholder="t('dept.employeeNo')" class="w-45!" clearable />
        </el-form-item>
        <!-- 状态 -->
        <el-form-item v-show="searchExpanded" :label="t('users.status')" prop="status">
          <el-select v-model="searchForm.status" :placeholder="t('users.status')" class="w-45!" clearable>
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
              <el-dropdown-item disabled>{{ t('users.importExcelComingSoon') }}</el-dropdown-item>
              <el-dropdown-item disabled>{{ t('buttons.exportExcel') }}</el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="batchKickAll()">
                {{ t('users.batchKickSessions') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="!hasSelection" @click="batchRefreshAuth()">
                {{ t('users.batchRefreshAuth') }}
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
              <el-dropdown-item disabled>{{ t('assign.role') }}</el-dropdown-item>
              <el-dropdown-item disabled>{{ t('assign.dept') }}</el-dropdown-item>
              <el-dropdown-item disabled>{{ t('assign.post') }}</el-dropdown-item>
              <el-dropdown-item @click="openAdminResetPasswordDialog(row.id, row.username)">
                {{ t('users.resetPassword') }}
              </el-dropdown-item>
              <!-- 查看会话 -->
              <el-dropdown-item @click="openViewSessionsDialog(row)">
                {{ t('users.viewSessions') }}
              </el-dropdown-item>
              <el-dropdown-item @click="kickUserSessions(row)">
                {{ t('users.kickSessions') }}
              </el-dropdown-item>
              <el-dropdown-item @click="refreshUserAuth(row)">
                {{ t('users.refreshAuth') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
