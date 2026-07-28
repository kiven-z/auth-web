<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { getFileRecyclePage } from '@/api/file/file-recycle';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
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
  fetchApi: getFileRecyclePage,
  searchForm: reactive({
    ownerUserId: undefined,
    bizType: undefined,
    bizId: undefined,
    contentType: undefined,
    originalName: undefined,
    startTime: undefined,
    endTime: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = fileRecycleState;
const { openDetailDialog, deleteBatchRows, restoreBatchRows } = useFileRecycleTableAction({
  fetchTableData,
  selectedRows,
});

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch();

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

/**
 * 重置查询条件并重新查询。
 */
async function handleReset(): Promise<void> {
  fileRecycleState.searchForm.startTime = undefined;
  fileRecycleState.searchForm.endTime = undefined;
  await resetQuery(searchFormRef.value);
}

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
      <!-- 归属用户筛选 -->
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
      <!-- 业务类型筛选 -->
      <el-form-item :label="t('fileRecycle.fields.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.bizType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <!-- 业务ID筛选 -->
      <el-form-item :label="t('fileRecycle.fields.bizId')" prop="bizId">
        <el-input
          v-model="searchForm.bizId"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.bizId')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <!-- 文件名筛选 -->
      <el-form-item :label="t('fileRecycle.fields.originalName')" prop="originalName">
        <el-input
          v-model="searchForm.originalName"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.originalName')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <!-- 文件类型筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecycle.fields.contentType')" prop="contentType">
          <el-input
            v-model="searchForm.contentType"
            :placeholder="placeholderBuilder.input('fileRecycle.fields.contentType')"
            class="w-42!"
            clearable
          />
        </el-form-item>
        <!-- 创建时间范围筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecycle.fields.createTimeRange')" prop="startTime">
          <el-date-picker
            v-model="searchForm.startTime"
            :placeholder="placeholderBuilder.rangeStart()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-42!"
            type="datetime"
          />
          <span class="mx-2">-</span>
          <el-date-picker
            v-model="searchForm.endTime"
            :placeholder="placeholderBuilder.rangeEnd()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-42!"
            type="datetime"
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="FILE_RECYCLE_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="FILE_RECYCLE_PERMS.QUERY" @click="handleReset">
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
      :state="fileRecycleState"
      :title="t('fileRecycle.page.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 批量恢复 -->
          <el-button
            v-perms="FILE_RECYCLE_PERMS.RESTORE"
            :disabled="selectedRows.length <= 0"
            type="primary"
            @click="restoreBatchRows()"
          >
            {{ t('buttons.actionBatchRestore') }}
          </el-button>
          <!-- 批量彻底删除 -->
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
        <!-- 恢复 -->
        <el-button v-perms="FILE_RECYCLE_PERMS.RESTORE" link type="primary" @click="restoreBatchRows([row.id])">
          {{ t('buttons.actionRestore') }}
        </el-button>
        <!-- 查看详情 -->
        <el-button v-perms="FILE_RECYCLE_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 彻底删除 -->
        <el-button v-perms="FILE_RECYCLE_PERMS.PURGE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
