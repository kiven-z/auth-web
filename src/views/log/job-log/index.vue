<script lang="ts" setup>
import { getJobLogPage } from '@/api/log/job-log';
import AuthDataTable from '@/components/ui/AuthDataTable';
import TableBar from '@/components/ui/TableBar';
import { usePaginationState } from '@/shared/hooks/usePaginationState';
import useJobLogTableAction from '@/views/log/job-log/hooks/useJobLogTableAction';
import useJobLogTableColumns from '@/views/log/job-log/hooks/useJobLogTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LOG_JOB_STATUS_CODES } from '@/views/log/job-log/constants/job-log-enums';

defineOptions({
  name: 'LogJobLog',
});

const { t } = useI18n();
const { columns } = useJobLogTableColumns();
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
  fetchApi: getJobLogPage,
  searchForm: reactive({
    jobName: undefined as string | undefined,
    jobGroup: undefined as string | undefined,
    invokeTarget: undefined as string | undefined,
    elapsedTime: undefined as number | undefined,
    status: undefined as string | undefined,
  }),
  errorI18nKey: 'logJob.loadFailed',
});

const { openDetailDialog, deleteRow, deleteBatchRows } = useJobLogTableAction({
  fetchTableData,
  selectedRows,
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
      <!-- 任务名称 -->
      <el-form-item :label="t('logJob.jobName')" prop="jobName">
        <el-input
          v-model="searchForm.jobName"
          :placeholder="t('logJob.placeholder.jobName')"
          class="w-[200px]!"
          clearable
        />
      </el-form-item>
      <!-- 任务分组 -->
      <el-form-item :label="t('logJob.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="t('logJob.placeholder.jobGroup')"
          class="w-[200px]!"
          clearable
        />
      </el-form-item>
      <!-- 调用目标 -->
      <el-form-item :label="t('logJob.invokeTarget')" prop="invokeTarget">
        <el-input
          v-model="searchForm.invokeTarget"
          :placeholder="t('logJob.placeholder.invokeTarget')"
          class="w-[220px]!"
          clearable
        />
      </el-form-item>
      <!-- 执行耗时(ms) -->
      <el-form-item :label="t('logJob.elapsedTime')" prop="elapsedTime">
        <el-input-number
          v-model="searchForm.elapsedTime"
          :placeholder="t('logJob.placeholder.elapsedTime')"
          class="w-[160px]!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('logJob.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="t('logJob.placeholder.status')"
          class="w-[180px]!"
          clearable
        >
          <el-option
            v-for="code in LOG_JOB_STATUS_CODES"
            :key="code"
            :label="t(`logJob.statusEnum.${code}`)"
            :value="code"
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
      :title="t('logJob.tableTitle')"
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
              <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
              <el-button link type="danger" @click="deleteRow(row)">{{ t('buttons.actionDelete') }}</el-button>
            </div>
          </template>
        </AuthDataTable>
      </template>
    </TableBar>
  </div>
</template>
