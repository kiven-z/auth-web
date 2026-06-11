<script lang="ts" setup>
import { getLoginLogPage } from '@/api/log/login-log';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/composables/dialog/useRemoteUserSearch';
import { LOGIN_LOG_RESULT_ITEMS, LOGIN_LOG_TYPE_CODES } from '@/views/log/login-log/constants/login-log-enums';
import useLoginLogTableAction from '@/views/log/login-log/hooks/useLoginLogTableAction';
import useLoginLogTableColumns from '@/views/log/login-log/hooks/useLoginLogTableColumns';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
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
  errorI18nKey: 'loginLog.loadFailed',
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = loginLogState;

const { openDetailDialog, deleteBatchRows } = useLoginLogTableAction({ fetchTableData, selectedRows });

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'loginLog.loadFailed',
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <el-form-item :label="t('loginLog.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('loginLog.user')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.loginResult')" prop="loginResult">
        <el-select
          v-model="searchForm.loginResult"
          :placeholder="ph.selectFilter('loginLog.loginResult')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="item in LOGIN_LOG_RESULT_ITEMS"
            :key="item.code"
            :label="t(`loginLog.loginResultEnum.${item.code}`)"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.loginTime')" prop="loginTime">
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

      <el-form-item :label="t('loginLog.loginType')" prop="loginType">
        <el-select
          v-model="searchForm.loginType"
          :placeholder="ph.selectFilter('loginLog.loginType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="lt in LOGIN_LOG_TYPE_CODES"
            :key="lt"
            :label="t(`loginLog.loginTypeEnum.${lt}`)"
            :value="lt"
          />
        </el-select>
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

    <AuthPagedTable :columns="columns" :state="loginLogState" :title="t('loginLog.tableTitle')" show-overflow-tooltip>
      <template #buttons>
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
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <el-button link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
