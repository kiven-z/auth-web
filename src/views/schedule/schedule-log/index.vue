<script lang="ts" setup>
import { getJobLogPage } from '@/api/log/job-log';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { SYS_JOB_LOG_PERMS } from '@/views/schedule/schedule-log/constants/permissions';
import useJobLogOptions from '@/views/schedule/schedule-log/hooks/options/useJobLogOptions';
import useJobLogTableAction from '@/views/schedule/schedule-log/hooks/useJobLogTableAction';
import useJobLogTableColumns from '@/views/schedule/schedule-log/hooks/useJobLogTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LogJobLog',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusOptions: jobLogStatusOptions, triggerTypeOptions: jobLogTriggerTypeOptions } = useJobLogOptions();
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
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = jobLogState;

const { openDetailDialog, deleteBatchRows } = useJobLogTableAction({ fetchTableData, selectedRows });

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(7);

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
      <el-form-item :label="t('logJob.field.jobId')" prop="jobId">
        <el-input v-model="searchForm.jobId" :placeholder="ph.input('logJob.field.jobId')" class="w-45!" clearable />
      </el-form-item>
      <el-form-item :label="t('logJob.field.jobName')" prop="jobName">
        <el-input
          v-model="searchForm.jobName"
          :placeholder="ph.input('logJob.field.jobName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('logJob.field.jobGroup')" prop="jobGroup">
        <el-input
          v-model="searchForm.jobGroup"
          :placeholder="ph.input('logJob.field.jobGroup')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('logJob.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('logJob.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in jobLogStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('logJob.field.invokeTarget')" prop="invokeTarget">
          <el-input
            v-model="searchForm.invokeTarget"
            :placeholder="ph.input('logJob.field.invokeTarget')"
            class="w-45!"
            clearable
          />
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('logJob.field.triggerType')" prop="triggerType">
          <el-select
            v-model="searchForm.triggerType"
            :placeholder="ph.selectFilter('logJob.field.triggerType')"
            class="w-45!"
            clearable
          >
            <el-option v-for="opt in jobLogTriggerTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('logJob.field.elapsedTime')" prop="elapsedTime">
          <el-input-number
            v-model="searchForm.elapsedTime"
            :placeholder="ph.input('logJob.field.elapsedTime')"
            class="w-40!"
            clearable
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button-group>
          <el-button v-perms="SYS_JOB_LOG_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="SYS_JOB_LOG_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
            {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="columns" :state="jobLogState" :title="t('logJob.title.table')" show-overflow-tooltip>
      <template #buttons>
        <el-dropdown trigger="click">
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>

          <template #dropdown>
            <Perms :value="SYS_JOB_LOG_PERMS.DELETE">
              <el-dropdown-item :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
                {{ t('buttons.actionBatchDelete') }}
              </el-dropdown-item>
            </Perms>
          </template>
        </el-dropdown>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_JOB_LOG_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="SYS_JOB_LOG_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
