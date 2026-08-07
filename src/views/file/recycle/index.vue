<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { getFileRecyclePage } from '@/api/file/file-recycle';
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { FILE_RECYCLE_PERMS } from '@/views/file/recycle/constants/permissions';
import useFileRecycleTableAction from '@/views/file/recycle/hooks/useFileRecycleTableAction';
import useFileRecycleTableColumns from '@/views/file/_shared/columns/useFileRecycleTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'FileRecycle',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useFileRecycleTableColumns();
const searchFormRef = ref<FormInstance>();

const fileRecycleState = usePaginationState({
  fetchApi: (params) => {
    const { createdAtRange, ...rest } = params;
    return getFileRecyclePage({
      ...rest,
      startTime: createdAtRange?.[0],
      endTime: createdAtRange?.[1],
    });
  },
  searchForm: reactive({
    ownerUserId: undefined,
    bizType: undefined,
    bizId: undefined,
    contentType: undefined,
    originalName: undefined,
    createdAtRange: undefined as [string, string] | undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = fileRecycleState;
const { openDetailDialog, deleteBatchRows, restoreBatchRows } = useFileRecycleTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

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
      <el-form-item :label="t('fileRecycle.fields.ownerUserId')" prop="ownerUserId">
        <el-select
          v-model="searchForm.ownerUserId"
          :loading="userSearchLoading"
          :placeholder="placeholderBuilder.keyword('fileRecycle.fields.ownerUserId')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fileRecycle.fields.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.bizType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecycle.fields.bizId')" prop="bizId">
        <el-input
          v-model="searchForm.bizId"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.bizId')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecycle.fields.originalName')" prop="originalName">
        <el-input
          v-model="searchForm.originalName"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.originalName')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('fileRecycle.fields.contentType')" prop="contentType">
          <el-input
            v-model="searchForm.contentType"
            :placeholder="placeholderBuilder.input('fileRecycle.fields.contentType')"
            class="w-42!"
            clearable
          />
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('fileRecycle.fields.createdAtRange')" prop="createdAtRange">
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
        <el-button-group>
          <el-button v-perms="FILE_RECYCLE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="FILE_RECYCLE_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
          <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
            {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="columns" :state="fileRecycleState" :title="t('fileRecycle.page.tableTitle')">
      <template #buttons>
        <el-button-group type="primary">
          <el-button
            v-perms="FILE_RECYCLE_PERMS.RESTORE"
            :disabled="selectedRows.length <= 0"
            type="primary"
            @click="restoreBatchRows()"
          >
            {{ t('buttons.actionBatchRestore') }}
          </el-button>
          <el-button
            v-perms="FILE_RECYCLE_PERMS.PURGE"
            :disabled="selectedRows.length <= 0"
            type="danger"
            @click="deleteBatchRows()"
          >
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="FILE_RECYCLE_PERMS.RESTORE" link type="primary" @click="restoreBatchRows([row.id])">
          {{ t('buttons.actionRestore') }}
        </el-button>
        <el-button v-perms="FILE_RECYCLE_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button v-perms="FILE_RECYCLE_PERMS.PURGE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </PagedTable>
  </div>
</template>
