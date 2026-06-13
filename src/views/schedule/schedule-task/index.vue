<script lang="ts" setup>
import { hasAuth } from '@/auth/permission';
import { getJobPage } from '@/api/schedule/job';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/constants/boolean-status';
import { BUSY_QUARTZ_RUNTIME_STATUSES } from '@/views/schedule/schedule-task/constants/job-quartz-runtime-status';
import useJobTableAction from '@/views/schedule/schedule-task/hooks/useJobTableAction';
import useJobTableColumns from '@/views/schedule/schedule-task/hooks/useJobTableColumns';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ScheduleTask',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useJobTableColumns();
const searchFormRef = ref<FormInstance>();

const jobState = usePaginationState({
  fetchApi: getJobPage,
  searchForm: reactive({
    jobName: undefined,
    jobGroup: undefined,
    status: undefined,
  }),
  errorI18nKey: 'scheduleTask.loadFailed',
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = jobState;

const { openCreateDialog, openDetailDialog, openEditDialog, runOnce, deleteBatchRows, batchUpdateStatus } =
  useJobTableAction({
    fetchTableData,
    selectedRows,
  });

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 任务名称 -->
      <el-form-item :label="t('scheduleTask.jobName')" prop="jobName">
        <el-input
          v-model="searchForm.jobName"
          :placeholder="ph.input('scheduleTask.jobName')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <!-- 任务分组 -->
      <el-form-item :label="t('scheduleTask.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="ph.input('scheduleTask.jobGroup')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <!-- 运行状态 -->
      <el-form-item :label="t('scheduleTask.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('scheduleTask.status')"
          class="w-40!"
          clearable
        >
          <el-option
            v-for="opt in COMMON_BOOLEAN_STATUS_FILTER_OPTIONS"
            :key="`${opt.labelKey}:${String(opt.value)}`"
            :label="t(opt.labelKey)"
            :value="opt.value"
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

    <AuthPagedTable
      :adaptive-config="{ offsetBottom: 96 }"
      :columns="columns"
      :state="jobState"
      :title="t('scheduleTask.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 新增 -->
          <el-button @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <!-- 批量启停 -->
          <el-dropdown v-if="hasAuth('sysJob:update')" trigger="click">
            <el-button :disabled="selectedRows.length <= 0" type="warning">
              {{ t('buttons.actionBatchStatus') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(selectedRows, true)">
                {{ t('buttons.actionBatchEnable') }}
              </el-dropdown-item>
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="batchUpdateStatus(selectedRows, false)">
                {{ t('buttons.actionBatchDisable') }}
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看 -->
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改 -->
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
          <!-- 立即执行：调度暂停且 Quartz 非执行/排队时可用 -->
          <el-button
            v-if="hasAuth('sysJob:update')"
            :disabled="BUSY_QUARTZ_RUNTIME_STATUSES.has(row.quartzRuntimeStatus)"
            link
            type="warning"
            @click="runOnce(row)"
          >
            {{ t('scheduleTask.actionRunOnce') }}
          </el-button>
          <!-- 删除 -->
          <el-button v-if="hasAuth('sysJob:delete')" link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
          <!-- 更多 -->
          <el-dropdown v-if="hasAuth('sysJob:update')" class="ml-2" trigger="click">
            <el-button class="el-dropdown-link" link type="primary">{{ t('buttons.actionMore') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :disabled="row.status === true" @click="batchUpdateStatus([row.id], true)">
                  {{ t('buttons.statusActiveText') }}
                </el-dropdown-item>
                <el-dropdown-item :disabled="row.status === false" @click="batchUpdateStatus([row.id], false)">
                  {{ t('buttons.statusInactiveText') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
