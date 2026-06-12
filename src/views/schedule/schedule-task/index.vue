<script lang="ts" setup>
import { getJobPage } from '@/api/schedule/job';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/constants/boolean-status';
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

const { loading, searchForm, fetchTableData, resetQuery } = jobState;

const { openCreateDialog, openDetailDialog, openEditDialog } = useJobTableAction({ fetchTableData });

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
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看 -->
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改 -->
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
