<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { queryPersonalFileExportTaskPage } from '@/api/file/file-me-export-task';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import usePersonalFileExportTaskTableColumns from '@/views/file/me/export-task/hooks/columns/usePersonalFileExportTaskTableColumns';
import usePersonalFileExportTaskOptions from '@/views/file/me/export-task/hooks/options/usePersonalFileExportTaskOptions';
import usePersonalFileExportTaskTableAction from '@/views/file/me/export-task/hooks/usePersonalFileExportTaskTableAction';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PersonalFileExportTask',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = usePersonalFileExportTaskTableColumns();
const { statusOptions, exportFormatOptions } = usePersonalFileExportTaskOptions();
const { openDetailDialog } = usePersonalFileExportTaskTableAction();
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

const { loading, searchForm, fetchTableData, resetQuery } = personalFileExportTaskState;

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
        <el-button-group>
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="columns" :state="personalFileExportTaskState" :title="t('fileExportTask.page.tableTitle')">
      <template #actions="{ row }">
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
      </template>
    </PagedTable>
  </div>
</template>
