<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { queryPersonalFileRecyclePage } from '@/api/file/file-me-recycle';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import useFileRecycleTableColumns from '@/views/file/_shared/columns/useFileRecycleTableColumns';
import usePersonalFileRecycleTableAction from '@/views/file/me/recycle/hooks/usePersonalFileRecycleTableAction';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PersonalFileRecycle',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useFileRecycleTableColumns();
const searchFormRef = ref<FormInstance>();

const personalFileRecycleState = usePaginationState({
  fetchApi: (params) => {
    const { createTimeRange, ...rest } = params;
    return queryPersonalFileRecyclePage({
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
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = personalFileRecycleState;
const { openDetailDialog, deleteBatchRows, restoreBatchRows } = usePersonalFileRecycleTableAction({
  fetchTableData,
  selectedRows,
});

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(5);

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
      <!-- 文件类型筛选 -->
      <el-form-item :label="t('fileRecycle.fields.contentType')" prop="contentType">
        <el-input
          v-model="searchForm.contentType"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.contentType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <!-- 创建时间范围筛选 -->
        <el-form-item v-show="searchExpanded" :label="t('fileRecycle.fields.createTimeRange')" prop="createTimeRange">
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
      :state="personalFileRecycleState"
      :title="t('fileRecycle.page.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group type="primary">
          <!-- 批量恢复 -->
          <el-button :disabled="selectedRows.length <= 0" type="primary" @click="restoreBatchRows()">
            {{ t('buttons.actionBatchRestore') }}
          </el-button>
          <!-- 批量彻底删除 -->
          <el-button :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows()">
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <!-- 恢复 -->
        <el-button link type="primary" @click="restoreBatchRows([row.id])">
          {{ t('buttons.actionRestore') }}
        </el-button>
        <!-- 查看详情 -->
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <!-- 彻底删除 -->
        <el-button link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
