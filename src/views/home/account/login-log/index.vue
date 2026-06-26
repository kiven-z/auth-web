<script lang="ts" setup>
import { getMyLoginLogPage } from '@/api/system/user-me';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import useMeLoginLogTableColumns from '@/views/home/account/login-log/hooks/useMeLoginLogTableColumns';
import { LOGIN_LOG_RESULT_ITEMS, LOGIN_LOG_TYPE_FILTER_OPTIONS } from '@/views/log/login-log/constants/login-log-enums';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AccountLoginLog',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { meLoginLogTableColumns } = useMeLoginLogTableColumns();
const searchFormRef = ref<FormInstance>();

const loginLogState = usePaginationState({
  fetchApi: (params) => getMyLoginLogPage(params),
  searchForm: reactive({
    loginResult: undefined,
    loginType: undefined,
  }),
  errorI18nKey: 'account.message.loadFailed',
  defaultPageSize: 10,
});

const { loading, fetchTableData, resetQuery } = loginLogState;

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :model="loginLogState.searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-2 pt-1"
      inline
    >
      <el-form-item :label="t('loginLog.field.loginResult')" prop="loginResult">
        <el-select
          v-model="loginLogState.searchForm.loginResult"
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

      <el-form-item :label="t('loginLog.field.loginType')" prop="loginType">
        <el-select
          v-model="loginLogState.searchForm.loginType"
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
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <el-alert :closable="false" class="mx-2 mb-2!" show-icon type="info">
      {{ t('account.hint.loginLogRetention') }}
    </el-alert>

    <AuthPagedTable
      :columns="meLoginLogTableColumns"
      :state="loginLogState"
      :title="t('account.loginLog')"
      show-overflow-tooltip
    />
  </div>
</template>
