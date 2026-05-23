<script lang="ts" setup>
import { getOperationLogPage } from '@/api/log/operation-log';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import useRemoteUserSearch from '@/shared/hooks/useRemoteUserSearch';
import { OPERATION_TYPES, REQUEST_METHODS } from '@/views/log/operation-log/constants/operation-log-enums';
import useOperationLogTableAction from '@/views/log/operation-log/hooks/useOperationLogTableAction';
import useOperationLogTableColumns from '@/views/log/operation-log/hooks/useOperationLogTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogOperationLog',
});

const { t } = useI18n();
const { columns } = useOperationLogTableColumns();
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
  fetchApi: getOperationLogPage,
  searchForm: reactive({
    userId: undefined as string | undefined,
    operationType: undefined as string | undefined,
    module: undefined as string | undefined,
    targetType: undefined as string | undefined,
    targetId: undefined as string | undefined,
    requestMethod: undefined as string | undefined,
  }),
  errorI18nKey: 'operationLog.loadFailed',
});

// 操作列按钮事件
const { openDetailDialog, deleteBatchRows } = useOperationLogTableAction({
  fetchTableData,
  selectedRows,
});

// 用户搜索
const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'operationLog.loadFailed',
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
      <!-- 操作用户 -->
      <el-form-item :label="t('operationLog.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="t('operationLog.placeholder.userId')"
          :remote-method="loadUserListByKeyword"
          class="w-[180px]!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <!-- 操作类型 -->
      <el-form-item :label="t('operationLog.operationType')" prop="operationType">
        <el-select
          v-model="searchForm.operationType"
          :placeholder="t('operationLog.placeholder.operationType')"
          class="w-[180px]!"
          clearable
        >
          <el-option
            v-for="type in OPERATION_TYPES"
            :key="type"
            :label="t(`operationLog.operationTypeEnum.${type}`)"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <!-- 操作模块 -->
      <el-form-item :label="t('operationLog.module')" prop="module">
        <el-input
          v-model="searchForm.module"
          :placeholder="t('operationLog.placeholder.module')"
          class="w-[180px]!"
          clearable
        />
      </el-form-item>

      <!-- 目标类型 -->
      <el-form-item :label="t('operationLog.targetType')" prop="targetType">
        <el-input
          v-model="searchForm.targetType"
          :placeholder="t('operationLog.placeholder.targetType')"
          class="w-[180px]!"
          clearable
        />
      </el-form-item>

      <!-- 目标 ID -->
      <el-form-item :label="t('operationLog.targetId')" prop="targetId">
        <el-input
          v-model="searchForm.targetId"
          :placeholder="t('operationLog.placeholder.targetId')"
          class="w-[180px]!"
          clearable
        />
      </el-form-item>

      <!-- HTTP 方法 -->
      <el-form-item :label="t('operationLog.requestMethod')" prop="requestMethod">
        <el-select
          v-model="searchForm.requestMethod"
          :placeholder="t('operationLog.placeholder.requestMethod')"
          class="w-[180px]!"
          clearable
        >
          <el-option v-for="rm in REQUEST_METHODS" :key="rm" :label="rm" :value="rm" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <TableBar
      :columns="columns"
      :title="t('operationLog.tableTitle')"
      @fullscreen="tableRef?.setAdaptive()"
      @refresh="fetchTableData"
    >
      <template #buttons>
        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>

          <template #dropdown>
            <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
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
              <el-button link type="danger" @click="deleteBatchRows([row.id])">
                {{ t('buttons.actionDelete') }}
              </el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>
