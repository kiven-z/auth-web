<script lang="ts" setup>
import {
  cancelPersonalFileExportTask,
  getPersonalFileExportTaskDetail,
  getPersonalFileExportTaskDownloadLink,
  queryPersonalFileExportTaskPage,
  retryPersonalFileExportTask,
} from '@/features/file/api/file-me-export-task';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/date-time';
import {
  FILE_EXPORT_TASK_CANCELLABLE_STATUS,
  FILE_EXPORT_TASK_DOWNLOADABLE_STATUS,
  FILE_EXPORT_TASK_RETRYABLE_STATUS,
  useFileExportTaskOptions,
  useFileExportTaskTableActionCore,
  useInProgressTablePoll,
} from '@/components/domain/file/file-export-task-table';
import usePersonalFileExportTaskTableColumns from '@/features/home/personal/panels/export-task/columns/use-personal-file-export-task-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import usePersonalFileExportTaskDetailColumns from './columns/use-personal-file-export-task-detail-columns';

defineOptions({
  name: 'PersonalExportTaskPanel',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = usePersonalFileExportTaskTableColumns();
const { statusOptions, exportFormatOptions } = useFileExportTaskOptions();
const searchFormRef = ref<FormInstance>();

const personalFileExportTaskState = usePaginationState({
  fetchApi: (params) => {
    const { createdAtRange, ...rest } = params;
    return queryPersonalFileExportTaskPage({
      ...rest,
      startTime: createdAtRange?.[0],
      endTime: createdAtRange?.[1],
    });
  },
  searchForm: reactive({
    bizType: undefined,
    status: undefined,
    exportFormat: undefined,
    createdAtRange: undefined as [string, string] | undefined,
  }),
});

const { loading, searchForm, tableData, fetchTableData, resetQuery } = personalFileExportTaskState;

const { detailColumns } = usePersonalFileExportTaskDetailColumns();
const { openDetailDialog, cancelTask, retryTask, downloadTask, currentDownloadingRowId } =
  useFileExportTaskTableActionCore({
    fetchTableData,
    detailApi: getPersonalFileExportTaskDetail,
    cancelApi: cancelPersonalFileExportTask,
    retryApi: retryPersonalFileExportTask,
    getDownloadLinkApi: getPersonalFileExportTaskDownloadLink,
    detailColumns,
  });

useInProgressTablePoll({ tableData, fetchTableData });

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
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('fileExportTask.fields.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="placeholderBuilder.input('fileExportTask.fields.bizType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileExportTask.fields.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="placeholderBuilder.selectFilter('fileExportTask.fields.status')"
          class="w-42!"
          clearable
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fileExportTask.fields.exportFormat')" prop="exportFormat">
        <el-select
          v-model="searchForm.exportFormat"
          :placeholder="placeholderBuilder.selectFilter('fileExportTask.fields.exportFormat')"
          class="w-42!"
          clearable
        >
          <el-option v-for="item in exportFormatOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fileExportTask.fields.createdAtRange')" prop="createdAtRange">
        <el-date-picker
          v-model="searchForm.createdAtRange"
          :end-placeholder="placeholderBuilder.rangeEnd()"
          :start-placeholder="placeholderBuilder.rangeStart()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-90!"
          type="datetimerange"
        />
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="personalFileExportTaskState" :title="t('fileExportTask.page.tableTitle')">
      <template #actions="{ row }">
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-if="FILE_EXPORT_TASK_DOWNLOADABLE_STATUS.has(row.status)"
          :loading="currentDownloadingRowId === row.id"
          link
          type="primary"
          @click="downloadTask(row)"
        >
          {{ t('buttons.actionDownload') }}
        </el-button>
        <el-button
          v-if="FILE_EXPORT_TASK_CANCELLABLE_STATUS.has(row.status)"
          link
          type="warning"
          @click="cancelTask(row)"
        >
          {{ t('fileExportTask.actions.cancel') }}
        </el-button>
        <el-button v-if="FILE_EXPORT_TASK_RETRYABLE_STATUS.has(row.status)" link type="warning" @click="retryTask(row)">
          {{ t('fileExportTask.actions.retry') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
