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
});

const { loading, fetchTableData, resetQuery } = loginLogState;

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="account-login-log">
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="loginLogState.searchForm"
      class="account-login-log__filter"
      inline
    >
      <el-form-item :label="t('loginLog.field.loginResult')" prop="loginResult">
        <el-select
          v-model="loginLogState.searchForm.loginResult"
          :placeholder="ph.selectFilter('loginLog.field.loginResult')"
          class="account-login-log__select"
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
          class="account-login-log__select"
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

    <el-alert :closable="false" class="account-login-log__hint" show-icon type="info">
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

<style lang="scss" scoped>
.account-login-log {
  &__filter {
    width: 99%;
    padding: 4px 0 0 8px;
    overflow: auto;
    background: var(--el-bg-color);
  }

  &__select {
    width: 180px;
  }

  &__hint {
    margin: 0 8px 8px;
  }
}
</style>
