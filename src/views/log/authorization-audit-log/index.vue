<script lang="ts" setup>
import { getAuthorizationAuditPage } from '@/api/log/authorization-audit';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import useRemoteUserSearch from '@/shared/hooks/useRemoteUserSearch';
import { AUDIT_EVENT_TYPES } from '@/views/log/authorization-audit-log/constants/authorization-audit-enums';
import useAuthorizationAuditTableAction from '@/views/log/authorization-audit-log/hooks/useAuthorizationAuditTableAction';
import useAuthorizationAuditTableColumns from '@/views/log/authorization-audit-log/hooks/useAuthorizationAuditTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogAuthorizationAudit',
});

const { t } = useI18n();
const { columns } = useAuthorizationAuditTableColumns();
const searchFormRef = ref<FormInstance>();
const tableRef = ref<{ setAdaptive: () => Promise<void> } | null>(null);

const {
  tableData,
  selectedRows,
  loading,
  pagination,
  searchForm,
  fetchTableData,
  resetQuery,
  handlePageSizeChange,
  handlePageCurrentChange,
  handleSelectionChange,
} = usePaginationState({
  fetchApi: getAuthorizationAuditPage,
  searchForm: reactive({
    eventType: undefined,
    decisionReason: undefined,
    className: undefined,
    createUserId: undefined,
  }),
  errorI18nKey: 'authorizationAudit.loadFailed',
});

const { openDetailDialog, deleteRow, deleteBatchRows } = useAuthorizationAuditTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'authorizationAudit.loadFailed',
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
      <!-- 事件类型 -->
      <el-form-item :label="t('authorizationAudit.eventType')" prop="eventType">
        <el-select
          v-model="searchForm.eventType"
          :placeholder="t('authorizationAudit.placeholder.eventType')"
          class="w-[180px]!"
          clearable
        >
          <el-option
            v-for="type in AUDIT_EVENT_TYPES"
            :key="type"
            :label="t(`authorizationAudit.eventTypeEnum.${type}`)"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationAudit.decisionReason')" prop="decisionReason">
        <el-input
          v-model="searchForm.decisionReason"
          :placeholder="t('authorizationAudit.placeholder.decisionReason')"
          class="w-[200px]!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationAudit.className')" prop="className">
        <el-input
          v-model="searchForm.className"
          :placeholder="t('authorizationAudit.placeholder.className')"
          class="w-[200px]!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('table.createUsername')" prop="createUserId">
        <el-select
          v-model="searchForm.createUserId"
          :loading="userSearchLoading"
          :placeholder="t('authorizationAudit.placeholder.createUserId')"
          :remote-method="loadUserListByKeyword"
          class="w-[200px]!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('authorizationAudit.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>

          <template #dropdown>
            <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows">
              {{ t('buttons.actionBatchDelete') }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </template>

      <template #default="{ size, dynamicColumns }">
        <AuthDataTable
          ref="tableRef"
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
              <!-- 查看 -->
              <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
              <!-- 删除 -->
              <el-button link type="danger" @click="deleteRow(row)">{{ t('buttons.actionDelete') }}</el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>
