<script lang="ts" setup>
import { getJobLogPage } from '@/api/log/job-log';
import AuthPagedTable, { usePaginationState } from '@/components/ui/AuthPagedTable';
import {
  LOG_JOB_STATUS_FILTER_OPTIONS,
  LOG_JOB_TRIGGER_TYPE_FILTER_OPTIONS,
} from '@/views/log/job-log/constants/job-log-enums';
import useJobLogTableAction from '@/views/log/job-log/hooks/useJobLogTableAction';
import useJobLogTableColumns from '@/views/log/job-log/hooks/useJobLogTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogJobLog',
});

const { t } = useI18n();
const { columns } = useJobLogTableColumns();
const searchFormRef = ref<FormInstance>();

const jobLogState = usePaginationState({
  fetchApi: getJobLogPage,
  searchForm: reactive({
    jobId: undefined,
    jobName: undefined,
    jobGroup: undefined,
    invokeTarget: undefined,
    triggerType: undefined,
    elapsedTime: undefined,
    status: undefined,
  }),
  errorI18nKey: 'logJob.loadFailed',
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = jobLogState;

const { openDetailDialog, deleteBatchRows } = useJobLogTableAction({
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
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 任务 ID -->
      <el-form-item :label="t('logJob.jobId')" prop="jobId">
        <el-input v-model="searchForm.jobId" :placeholder="t('logJob.placeholder.jobId')" class="w-45!" clearable />
      </el-form-item>
      <!-- 任务名称 -->
      <el-form-item :label="t('logJob.jobName')" prop="jobName">
        <el-input v-model="searchForm.jobName" :placeholder="t('logJob.placeholder.jobName')" class="w-45!" clearable />
      </el-form-item>
      <!-- 任务分组 -->
      <el-form-item :label="t('logJob.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="t('logJob.placeholder.jobGroup')"
          class="w-45!"
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
      <!-- 触发类型 -->
      <el-form-item :label="t('logJob.triggerType')" prop="triggerType">
        <el-select
          v-model="searchForm.triggerType"
          :placeholder="t('logJob.placeholder.triggerType')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in LOG_JOB_TRIGGER_TYPE_FILTER_OPTIONS"
            :key="opt.value"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <!-- 执行耗时(ms) -->
      <el-form-item :label="t('logJob.elapsedTime')" prop="elapsedTime">
        <el-input-number
          v-model="searchForm.elapsedTime"
          :placeholder="t('logJob.placeholder.elapsedTime')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="t('logJob.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('logJob.placeholder.status')" class="w-45!" clearable>
          <el-option
            v-for="opt in LOG_JOB_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">{{ t('buttons.actionSearch') }}</el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="jobLogState" :title="t('logJob.tableTitle')" show-overflow-tooltip>
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
