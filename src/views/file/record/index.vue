<script lang="ts" setup>
import { queryFileRecordPage } from '@/api/file/file-record';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { FILE_RECORD_PERMS } from '@/views/file/record/constants/permissions';
import useFileRecordTableAction from '@/views/file/record/hooks/useFileRecordTableAction';
import useFileRecordTableColumns from '@/views/file/record/hooks/useFileRecordTableColumns';
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
    originalName: undefined,
    startTime: undefined,
    endTime: undefined,
  }),
  errorI18nKey: 'fileRecord.messages.loadFailed',
});

const { loading, searchForm, pagination, fetchTableData, resetQuery } = fileRecordState;
const { detailLoadingId, openDetailDialog } = useFileRecordTableAction();

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'fileRecord.messages.loadFailed',
});

/**
 * 执行分页查询（切回第一页）。
 * @returns 无
 */
async function handleSearch(): Promise<void> {
  pagination.currentPage = 1;
  await fetchTableData();
}

/**
 * 重置查询条件并重新查询。
 * @returns 无
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
      <!-- 创建时间范围筛选 -->
      <el-form-item :label="t('fileRecord.fields.createTimeRange')" prop="startTime">
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

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="FILE_RECORD_PERMS.QUERY" :loading="loading" type="primary" @click="handleSearch">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="FILE_RECORD_PERMS.QUERY" @click="handleReset">
            {{ t('buttons.actionReset') }}
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
      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看详情 -->
          <el-button
            v-perms="FILE_RECORD_PERMS.QUERY"
            :loading="detailLoadingId === row.id"
            link
            type="primary"
            @click="openDetailDialog(row)"
          >
            {{ t('buttons.actionView') }}
          </el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
