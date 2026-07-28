<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { queryPersonalFileRecordPage } from '@/api/file/file-me-record';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import usePersonalFileRecordTableAction from '@/views/file/me/record/hooks/usePersonalFileRecordTableAction';
import useFileRecordTableColumns from '@/views/file/_shared/columns/useFileRecordTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PersonalFileRecord',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useFileRecordTableColumns();
const searchFormRef = ref<FormInstance>();

const personalFileRecordState = usePaginationState({
  fetchApi: (params) => {
    const { createTimeRange, ...rest } = params;
    return queryPersonalFileRecordPage({
      ...rest,
      startTime: createTimeRange?.[0],
      endTime: createTimeRange?.[1],
    });
  },
  searchForm: reactive({
    bizType: undefined,
    bizId: undefined,
    contentType: undefined,
    originalName: undefined,
    createTimeRange: undefined as [string, string] | undefined,
    isPrivate: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = personalFileRecordState;
const {
  deleteBatchRows,
  openDetailDialog,
  downloadRow,
  downloadBatchRows,
  batchDownloadLoading,
  currentDownloadingRowId,
} = usePersonalFileRecordTableAction({ fetchTableData, selectedRows });

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
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <!-- 业务类型筛选 -->
      <el-form-item :label="t('fileRecord.fields.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="placeholderBuilder.input('fileRecord.fields.bizType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <!-- 业务ID筛选 -->
      <el-form-item :label="t('fileRecord.fields.bizId')" prop="bizId">
        <el-input
          v-model="searchForm.bizId"
          :placeholder="placeholderBuilder.input('fileRecord.fields.bizId')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <!-- 文件名筛选 -->
      <el-form-item :label="t('fileRecord.fields.originalName')" prop="originalName">
        <el-input
          v-model="searchForm.originalName"
          :placeholder="placeholderBuilder.input('fileRecord.fields.originalName')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <!-- 文件类型筛选 -->
      <el-form-item :label="t('fileRecord.fields.contentType')" prop="contentType">
        <el-input
          v-model="searchForm.contentType"
          :placeholder="placeholderBuilder.input('fileRecord.fields.contentType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <!-- 是否私有文件筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.isPrivate')" prop="isPrivate">
          <el-select v-model="searchForm.isPrivate" class="w-42!" clearable>
            <el-option :label="t('status.yes')" :value="true" />
            <el-option :label="t('status.no')" :value="false" />
          </el-select>
        </el-form-item>
        <!-- 创建时间范围筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.createTimeRange')" prop="createTimeRange">
          <el-date-picker
            v-model="searchForm.createTimeRange"
            :end-placeholder="placeholderBuilder.rangeEnd()"
            :start-placeholder="placeholderBuilder.rangeStart()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-90!"
            type="datetimerange"
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <!-- 高级搜索 -->
          <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
            {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="personalFileRecordState"
      :title="t('fileRecord.page.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button
            :disabled="selectedRows.length <= 0"
            :loading="batchDownloadLoading"
            type="primary"
            @click="downloadBatchRows"
          >
            {{ t('buttons.actionBatchDownload') }}
          </el-button>
          <el-button :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows()">
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 下载文件 -->
        <el-button :loading="currentDownloadingRowId === row.id" link type="primary" @click="downloadRow(row.id)">
          {{ t('buttons.actionDownload') }}
        </el-button>
        <!-- 查看详情 -->
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 删除文件记录 -->
        <el-button link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
