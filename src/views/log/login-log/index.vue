<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { getLoginLogPage } from '@/api/log/login-log';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { SYS_LOG_LOGIN_PERMS } from '@/views/log/login-log/constants/permissions';
import useLoginLogOptions from '@/views/log/login-log/hooks/options/useLoginLogOptions';
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
const { loginResultOptions, loginTypeOptions } = useLoginLogOptions();
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
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = loginLogState;

const { openDetailDialog, deleteBatchRows } = useLoginLogTableAction({ fetchTableData, selectedRows });

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

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
          <el-option v-for="item in loginResultOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.field.loginTime')" prop="loginTimeStart">
        <el-date-picker
          v-model="searchForm.loginTimeStart"
          :placeholder="ph.rangeStart()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-40!"
          type="datetime"
        />
      </el-form-item>
      <el-form-item prop="loginTimeEnd">
        <el-date-picker
          v-model="searchForm.loginTimeEnd"
          :placeholder="ph.rangeEnd()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-40!"
          type="datetime"
        />
      </el-form-item>

      <el-form-item :label="t('loginLog.field.loginType')" prop="loginType">
        <el-select
          v-model="searchForm.loginType"
          :placeholder="ph.selectFilter('loginLog.field.loginType')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in loginTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button v-perms="SYS_LOG_LOGIN_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="SYS_LOG_LOGIN_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="columns" :state="loginLogState" :title="t('loginLog.title.table')">
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
    </PagedTable>
  </div>
</template>
