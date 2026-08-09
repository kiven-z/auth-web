<script lang="ts" setup>
import { queryAdminFileExportTaskPage } from '@/api/file/file-admin-export-task';
import { hasAuth } from '@/auth/permission';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import {
  FILE_EXPORT_TASK_CANCELLABLE_STATUS,
  FILE_EXPORT_TASK_RETRYABLE_STATUS,
} from '@/views/file/_shared/constants/file-export-task-status';
import useFileExportTaskOptions from '@/views/file/_shared/hooks/useFileExportTaskOptions';
import { FILE_EXPORT_TASK_PERMS } from '@/views/file/export-task/constants/permissions';
import useAdminFileExportTaskTableColumns from '@/views/file/export-task/hooks/columns/useAdminFileExportTaskTableColumns';
import useAdminFileExportTaskTableAction from '@/views/file/export-task/hooks/useAdminFileExportTaskTableAction';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'FileExportTask',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useAdminFileExportTaskTableColumns();
const { statusOptions, exportFormatOptions } = useFileExportTaskOptions();
const searchFormRef = ref<FormInstance>();

const fileExportTaskState = usePaginationState({
  fetchApi: (params) => {
    const { createdAtRange, ...rest } = params;
    return queryAdminFileExportTaskPage({
      ...rest,
      startTime: createdAtRange?.[0],
      endTime: createdAtRange?.[1],
    });
  },
  searchForm: reactive({
    createdBy: undefined,
    bizType: undefined,
    status: undefined,
    exportFormat: undefined,
    errorCode: undefined,
    createdAtRange: undefined as [string, string] | undefined,
  }),
});

const { loading, searchForm, fetchTableData, resetQuery } = fileExportTaskState;
const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();
const { openDetailDialog, openAttemptsDialog, forceCancelTask, forceRetryTask } = useAdminFileExportTaskTableAction({
  fetchTableData,
});
const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

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
      <el-form-item :label="t('fileExportTask.fields.createdBy')" prop="createdBy">
        <el-select
          v-model="searchForm.createdBy"
          :loading="userSearchLoading"
          :placeholder="placeholderBuilder.keyword('fileExportTask.fields.createdBy')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
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
      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('fileExportTask.fields.errorCode')" prop="errorCode">
          <el-input
            v-model="searchForm.errorCode"
            :placeholder="placeholderBuilder.input('fileExportTask.fields.errorCode')"
            class="w-42!"
            clearable
          />
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('fileExportTask.fields.createdAtRange')" prop="createdAtRange">
          <el-date-picker
            v-model="searchForm.createdAtRange"
            :end-placeholder="placeholderBuilder.rangeEnd()"
            :start-placeholder="placeholderBuilder.rangeStart()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-90!"
            type="datetimerange"
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button v-perms="FILE_EXPORT_TASK_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-perms="FILE_EXPORT_TASK_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
        <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
          {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="fileExportTaskState" :title="t('fileExportTask.page.adminTableTitle')">
      <template #actions="{ row }">
        <el-button v-perms="FILE_EXPORT_TASK_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="FILE_EXPORT_TASK_PERMS.QUERY" link type="primary" @click="openAttemptsDialog(row)">
          {{ t('fileExportTask.actions.viewAttempts') }}
        </el-button>

        <el-dropdown
          v-if="
            (FILE_EXPORT_TASK_CANCELLABLE_STATUS.has(row.status) && hasAuth(FILE_EXPORT_TASK_PERMS.CANCEL)) ||
            (FILE_EXPORT_TASK_RETRYABLE_STATUS.has(row.status) && hasAuth(FILE_EXPORT_TASK_PERMS.RETRY))
          "
          trigger="click"
        >
          <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          <template #dropdown>
            <el-dropdown-item
              v-if="FILE_EXPORT_TASK_CANCELLABLE_STATUS.has(row.status) && hasAuth(FILE_EXPORT_TASK_PERMS.CANCEL)"
              @click="forceCancelTask(row)"
            >
              {{ t('fileExportTask.actions.forceCancel') }}
            </el-dropdown-item>
            <el-dropdown-item
              v-if="FILE_EXPORT_TASK_RETRYABLE_STATUS.has(row.status) && hasAuth(FILE_EXPORT_TASK_PERMS.RETRY)"
              @click="forceRetryTask(row)"
            >
              {{ t('fileExportTask.actions.forceRetry') }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </template>
    </ListTable>
  </div>
</template>
