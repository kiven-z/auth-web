<script lang="ts" setup>
import { getJobGroupPage } from '@/api/schedule/job-group';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { COMMON_BOOLEAN_STATUS_FILTER_OPTIONS } from '@/constants/boolean-status';
import useJobGroupTableAction from '@/views/schedule/schedule-group/hooks/useJobGroupTableAction';
import useJobGroupTableColumns from '@/views/schedule/schedule-group/hooks/useJobGroupTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ScheduleJobGroup',
});

const { t } = useI18n();
const { columns } = useJobGroupTableColumns();
const searchFormRef = ref<FormInstance>();

const jobGroupState = usePaginationState({
  fetchApi: getJobGroupPage,
  searchForm: reactive({
    groupCode: undefined,
    groupName: undefined,
    status: undefined,
  }),
  errorI18nKey: 'scheduleGroup.loadFailed',
});

const { loading, searchForm, fetchTableData, resetQuery } = jobGroupState;

const { openCreateDialog, openEditDialog, openDetailDialog, deleteBatchRows } = useJobGroupTableAction({
  fetchTableData,
});

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3"
    >
      <!-- 分组编码 -->
      <el-form-item :label="t('scheduleGroup.code')" prop="groupCode">
        <el-input v-model="searchForm.groupCode" class="w-40!" clearable />
      </el-form-item>
      <!-- 分组名称 -->
      <el-form-item :label="t('scheduleGroup.name')" prop="groupName">
        <el-input v-model="searchForm.groupName" class="w-40!" clearable />
      </el-form-item>
      <!-- 分组状态 -->
      <el-form-item :label="t('scheduleGroup.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('scheduleGroup.status')" class="w-40!" clearable>
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
      :state="jobGroupState"
      :title="t('scheduleGroup.tableTitle')"
      show-overflow-tooltip
    >
      <template #buttons>
        <!-- 添加 -->
        <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-center">
          <!-- 查看 -->
          <el-button link type="primary" @click="openDetailDialog(row)">{{ t('buttons.actionView') }}</el-button>
          <!-- 修改/编辑 -->
          <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
          <!-- 删除 -->
          <el-button :disabled="row.isSystem" link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
      </template>
    </AuthPagedTable>
  </div>
</template>
