<script lang="ts" setup>
import { queryFileRecordPage } from '@/api/file/file-record';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { FILE_RECORD_PERMS } from '@/views/file/record/constants/permissions';
import useFileRecordTableAction from '@/views/file/record/hooks/useFileRecordTableAction';
import useFileRecordTableColumns from '@/views/file/_shared/columns/useFileRecordTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'FileRecord',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useFileRecordTableColumns();
const searchFormRef = ref<FormInstance>();

const fileRecordState = usePaginationState({
  fetchApi: queryFileRecordPage,
  searchForm: reactive({
    ownerUserId: undefined,
    bizType: undefined,
    bizId: undefined,
    contentType: undefined,
    originalName: undefined,
    startTime: undefined,
    endTime: undefined,
    isPrivate: undefined,
  }),
  errorI18nKey: 'fileRecord.messages.loadFailed',
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = fileRecordState;
const {
  deleteBatchRows,
  openDetailDialog,
  downloadRow,
  downloadBatchRows,
  batchDownloadLoading,
  currentDownloadingRowId,
  updatePrivacyRows,
  privacyUpdateLoading,
} = useFileRecordTableAction({ fetchTableData, selectedRows });

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'fileRecord.messages.loadFailed',
});

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(7);

/**
 * 重置查询条件并重新查询。
 */
async function handleReset(): Promise<void> {
  fileRecordState.searchForm.startTime = undefined;
  fileRecordState.searchForm.endTime = undefined;
  await resetQuery(searchFormRef.value);
}

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 归属用户筛选 -->
      <el-form-item :label="t('fileRecord.fields.ownerUserId')" prop="ownerUserId">
        <el-select
          v-model="searchForm.ownerUserId"
          :loading="userSearchLoading"
          :placeholder="placeholderBuilder.keyword('fileRecord.fields.ownerUserId')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
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
      <template v-if="showAdvancedSearchToggle">
        <!-- 文件类型筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.contentType')" prop="contentType">
          <el-input
            v-model="searchForm.contentType"
            :placeholder="placeholderBuilder.input('fileRecord.fields.contentType')"
            class="w-42!"
            clearable
          />
        </el-form-item>
        <!-- 是否私有文件筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.isPrivate')" prop="isPrivate">
          <el-select v-model="searchForm.isPrivate" class="w-42!" clearable>
            <el-option :label="t('status.yes')" :value="true" />
            <el-option :label="t('status.no')" :value="false" />
          </el-select>
        </el-form-item>
        <!-- 创建时间范围筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.createTimeRange')" prop="startTime">
          <el-date-picker
            v-model="searchForm.startTime"
            :placeholder="placeholderBuilder.rangeStart()"
            class="w-42!"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
          <span class="mx-2">-</span>
          <el-date-picker
            v-model="searchForm.endTime"
            :placeholder="placeholderBuilder.rangeEnd()"
            class="w-42!"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="FILE_RECORD_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="FILE_RECORD_PERMS.QUERY" @click="handleReset">
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
      :adaptive-config="{ offsetBottom: 96 }"
      :columns="columns"
      :state="fileRecordState"
      :title="t('fileRecord.page.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <el-button
            v-perms="FILE_RECORD_PERMS.DOWNLOAD"
            :disabled="selectedRows.length <= 0"
            :loading="batchDownloadLoading"
            type="primary"
            @click="downloadBatchRows"
          >
            {{ t('buttons.actionBatchDownload') }}
          </el-button>
          <el-button
            v-perms="FILE_RECORD_PERMS.PRIVACY"
            :disabled="selectedRows.length <= 0"
            :loading="privacyUpdateLoading"
            type="primary"
            @click="updatePrivacyRows(true)"
          >
            {{ t('fileRecord.actions.batchSetPrivate') }}
          </el-button>
          <el-button
            v-perms="FILE_RECORD_PERMS.PRIVACY"
            :disabled="selectedRows.length <= 0"
            :loading="privacyUpdateLoading"
            type="primary"
            @click="updatePrivacyRows(false)"
          >
            {{ t('fileRecord.actions.batchSetPublic') }}
          </el-button>
          <el-button
            v-perms="FILE_RECORD_PERMS.DELETE"
            :disabled="selectedRows.length <= 0"
            type="danger"
            @click="deleteBatchRows()"
          >
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 下载文件 -->
          <el-button
            v-perms="FILE_RECORD_PERMS.DOWNLOAD"
            :loading="currentDownloadingRowId === row.id"
            link
            type="primary"
            @click="downloadRow(row.id)"
          >
            {{ t('buttons.actionDownload') }}
          </el-button>
          <!-- 查看详情 -->
          <el-button v-perms="FILE_RECORD_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
            {{ t('buttons.actionView') }}
          </el-button>
          <!-- 设为私有 -->
          <el-button
            v-if="!row.isPrivate"
            v-perms="FILE_RECORD_PERMS.PRIVACY"
            :loading="privacyUpdateLoading"
            link
            type="warning"
            @click="updatePrivacyRows(true, [row.id])"
          >
            {{ t('fileRecord.actions.setPrivate') }}
          </el-button>
          <!-- 设为公开 -->
          <el-button
            v-if="row.isPrivate"
            v-perms="FILE_RECORD_PERMS.PRIVACY"
            :loading="privacyUpdateLoading"
            link
            type="success"
            @click="updatePrivacyRows(false, [row.id])"
          >
            {{ t('fileRecord.actions.setPublic') }}
          </el-button>
          <!-- 删除文件记录 -->
          <el-button v-perms="FILE_RECORD_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
