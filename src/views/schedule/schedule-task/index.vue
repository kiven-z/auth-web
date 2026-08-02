<script lang="ts" setup>
import { getJobPage } from '@/api/schedule/job';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_JOB_PERMS } from '@/views/schedule/schedule-task/constants/permissions';
import useJobTableAction from '@/views/schedule/schedule-task/hooks/useJobTableAction';
import useJobTableColumns from '@/views/schedule/schedule-task/hooks/useJobTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ScheduleTask',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { columns } = useJobTableColumns();
const searchFormRef = ref<FormInstance>();

const jobState = usePaginationState({
  fetchApi: getJobPage,
  searchForm: reactive({
    jobName: undefined,
    jobGroup: undefined,
    status: undefined,
  }),
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
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('scheduleTask.fields.jobName')" prop="jobName">
        <el-input
          v-model="searchForm.jobName"
          :placeholder="ph.input('scheduleTask.fields.jobName')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('scheduleTask.fields.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="ph.input('scheduleTask.fields.jobGroup')"
          class="w-40!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('scheduleTask.fields.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('scheduleTask.fields.status')"
          class="w-40!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button v-perms="SYS_JOB_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="SYS_JOB_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="jobState"
      :title="t('scheduleTask.page.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button v-perms="SYS_JOB_PERMS.CREATE" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>

          <Perms :value="SYS_JOB_PERMS.UPDATE">
            <el-dropdown trigger="click">
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
          </Perms>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_JOB_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_JOB_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_JOB_PERMS.UPDATE" link type="warning" @click="runOnce(row)">
          {{ t('scheduleTask.actions.runOnce') }}
        </el-button>
        <el-button v-perms="SYS_JOB_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
        <Perms :value="SYS_JOB_PERMS.UPDATE">
          <el-dropdown trigger="click">
            <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
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
        </Perms>
      </template>
    </AuthPagedTable>
  </div>
</template>
