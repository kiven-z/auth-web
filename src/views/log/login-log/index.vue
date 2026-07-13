<script lang="ts" setup>
import { getLoginLogPage } from '@/api/log/login-log';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { LOGIN_LOG_RESULT_ITEMS, LOGIN_LOG_TYPE_FILTER_OPTIONS } from '@/views/log/login-log/constants/login-log-enums';
import { SYS_LOG_LOGIN_PERMS } from '@/views/log/login-log/constants/permissions';
import useLoginLogTableAction from '@/views/log/login-log/hooks/useLoginLogTableAction';
import useLoginLogTableColumns from '@/views/log/login-log/hooks/useLoginLogTableColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogLoginLog',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useLoginLogTableColumns();
const searchFormRef = ref<FormInstance>();

const loginLogState = usePaginationState({
  fetchApi: getLoginLogPage,
  searchForm: reactive({
    userId: undefined,
    loginTimeStart: undefined,
    loginTimeEnd: undefined,
    loginResult: undefined,
    loginType: undefined,
  }),
  errorI18nKey: 'loginLog.message.loadFailed',
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = loginLogState;

const { openDetailDialog, deleteBatchRows } = useLoginLogTableAction({ fetchTableData, selectedRows });

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'loginLog.message.loadFailed',
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <el-form-item :label="t('loginLog.field.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('loginLog.field.user')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.field.loginResult')" prop="loginResult">
        <el-select
          v-model="searchForm.loginResult"
          :placeholder="ph.selectFilter('loginLog.field.loginResult')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in LOGIN_LOG_RESULT_ITEMS"
            :key="item.code"
            :label="t(item.labelKey)"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.field.loginTime')" prop="loginTime">
        <el-date-picker
          v-model="searchForm.loginTimeStart"
          :placeholder="ph.rangeStart()"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.loginTimeEnd"
          :placeholder="ph.rangeEnd()"
          class="w-40!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>

      <el-form-item :label="t('loginLog.field.loginType')" prop="loginType">
        <el-select
          v-model="searchForm.loginType"
          :placeholder="ph.selectFilter('loginLog.field.loginType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in LOGIN_LOG_TYPE_FILTER_OPTIONS"
            :key="item.value"
            :label="t(item.labelKey)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="SYS_LOG_LOGIN_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_LOG_LOGIN_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="loginLogState" :title="t('loginLog.title.table')" show-overflow-tooltip>
      <template #buttons>
        <Perms :value="SYS_LOG_LOGIN_PERMS.DELETE">
          <el-dropdown trigger="click">
            <el-button type="danger">
              {{ t('buttons.actionAdvanced') }}
            </el-button>

            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </Perms>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_LOG_LOGIN_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_LOG_LOGIN_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
