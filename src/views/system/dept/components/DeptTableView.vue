<script lang="ts" setup>
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import DeptRowActions from '@/views/system/dept/components/DeptRowActions.vue';
import { DEPT_STATUS_FILTER_OPTIONS } from '@/views/system/dept/constants/dept-search-options';
import useDeptMoreAction from '@/views/system/dept/hooks/actions/useDeptMoreAction';
import useDeptPageState from '@/views/system/dept/hooks/useDeptPageState';
import useDeptTableAction from '@/views/system/dept/hooks/actions/useDeptTableAction';
import DeptHeadButtons from '@/views/system/dept/components/DeptHeadButtons.vue';
import useDeptTableColumns from '@/views/system/dept/hooks/columns/useDeptTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptTableView',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const { tableColumns } = useDeptTableColumns();
const deptState = useDeptPageState();
const { loading, selectedRows, searchForm, viewMode, fetchTableData, fetchTreeData, resetQuery, refresh } = deptState;

const tableActionDeps = {
  fetchTableData,
  fetchTreeData,
  refresh,
  viewMode,
  selectedRows,
};

const { openDetailDialog, openEditDialog, deleteBatchRows } = useDeptTableAction(tableActionDeps);

const { openAssignRoleDrawer } = useDeptMoreAction(tableActionDeps);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <el-form-item :label="t('dept.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('dept.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
        <el-input
          v-model="searchForm.deptCode"
          :placeholder="ph.input('dept.field.deptCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('dept.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('dept.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in DEPT_STATUS_FILTER_OPTIONS"
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
      :columns="tableColumns"
      :state="deptState"
      :title="t('dept.page.title')"
      show-overflow-tooltip
    >
      <template #buttons>
        <DeptHeadButtons />
      </template>

      <template #actions="{ row }">
        <DeptRowActions
          :delete-batch-rows="deleteBatchRows"
          :open-assign-role-drawer="openAssignRoleDrawer"
          :open-detail-dialog="openDetailDialog"
          :open-edit-dialog="openEditDialog"
          :row="row"
        />
      </template>
    </AuthPagedTable>
  </div>
</template>
