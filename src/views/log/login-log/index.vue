<script lang="ts" setup>
import TableBar from '@/components/ui/TableBar';
import useRemoteUserSearch from '@/shared/hooks/useRemoteUserSearch';
import { LOGIN_LOG_RESULT_CODES, LOGIN_LOG_TYPE_CODES } from '@/views/log/login-log/constants/login-log-enums';
import useLoginLogPageState from '@/views/log/login-log/hooks/useLoginLogPageState';
import useLoginLogTableAction from '@/views/log/login-log/hooks/useLoginLogTableAction';
import useLoginLogTableColumns from '@/views/log/login-log/hooks/useLoginLogTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogLoginLog',
});

const { t } = useI18n();
const { columns } = useLoginLogTableColumns();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  loading,
  pagination,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
} = useLoginLogPageState();
const { selectedRows, handleSelectionChange, openDetailDialog, deleteRow, deleteBatchRows } = useLoginLogTableAction({
  fetchTableData,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'loginLog.loadFailed',
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-[12px]"
    >
      <el-form-item :label="t('loginLog.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="t('loginLog.placeholder.userId')"
          :remote-method="loadUserListByKeyword"
          class="w-[200px]!"
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
          :placeholder="t('loginLog.placeholder.loginResult')"
          class="w-[180px]!"
          clearable
        >
          <el-option
            v-for="code in LOGIN_LOG_RESULT_CODES"
            :key="code"
            :label="t(`loginLog.loginResultEnum.${code}`)"
            :value="code"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('loginLog.loginTime')" prop="loginTime">
        <el-date-picker
          v-model="searchForm.loginTimeStart"
          :placeholder="t('loginLog.loginTimeStart')"
          class="w-[160px]!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
        <span class="mx-2">-</span>
        <el-date-picker
          v-model="searchForm.loginTimeEnd"
          :placeholder="t('loginLog.loginTimeEnd')"
          class="w-[160px]!"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>

      <el-form-item :label="t('loginLog.loginType')" prop="loginType">
        <el-select
          v-model="searchForm.loginType"
          :placeholder="t('loginLog.placeholder.loginType')"
          class="w-[180px]!"
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
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('loginLog.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>

          <template #dropdown>
            <el-dropdown-item :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows">
              {{ t('buttons.actionBatchDelete') }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          ref="tableRef"
          :adaptiveConfig="{ offsetBottom: 96 }"
          :columns="dynamicColumns"
          :data="tableData"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          :loading="loading"
          :pagination="pagination"
          :size="size"
          adaptive
          align-whole="center"
          border
          highlight-current-row
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          @page-size-change="handlePageSizeChange"
          @page-current-change="handlePageCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <template #actions="{ row }">
            <div class="flex justify-center">
              <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
              <el-button link type="danger" @click="deleteRow(row)">{{ t('buttons.actionDelete') }}</el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>

<style lang="scss" scoped></style>
