<script lang="ts" setup>
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { USER_DEPT_RELATION_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-dept-relation-status';
import useUserAssignDeptDrawerAction from '@/views/system/user/hooks/actions/useUserAssignDeptDrawerAction';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserDeptAssignTableColumns from '@/views/system/user/hooks/columns/useUserDeptAssignTableColumns';
import { getUserDeptPage, UserDeptPageRow } from '@/api/system/user-dept';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';

defineOptions({ name: 'UserAssignDeptDrawer' });

const props = defineProps<{
  userId: string;
  username: string;
  nickname?: string | null;
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();

const searchFormRef = ref<FormInstance>();

const deptAssignState = usePaginationState<UserDeptPageRow>({
  searchForm: reactive({
    deptName: undefined,
    deptCode: undefined,
    status: undefined,
  }),
  defaultPageSize: 30,
  errorI18nKey: 'tips.assignLoadFailed',
  fetchApi: (query) =>
    getUserDeptPage(props.userId, {
      pageIndex: query.pageIndex as number,
      pageSize: query.pageSize as number,
      deptName: query.deptName as string,
      deptCode: query.deptCode as string,
      status: query.status as number,
    }),
});
const { fetchTableData, resetQuery, loading, searchForm, selectedRows } = deptAssignState;

const { openCreateDialog, openEditDialog, deleteBatchRows, clearAllDepts } = useUserAssignDeptDrawerAction({
  userId: props.userId,
  fetchTableData,
  selectedRows,
});

const hasSelection = computed(() => selectedRows.value.length > 0);

const { columns } = useUserDeptAssignTableColumns();

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="flex flex-col">
    <el-alert :title="t('users.deptAssignDrawerTip')" closable show-icon type="info" />
    <el-form ref="searchFormRef" :model="searchForm" class="pt-2 pl-6" inline>
      <!-- 部门名称 -->
      <el-form-item :label="t('dept.deptName')" prop="deptName">
        <el-input v-model="searchForm.deptName" :placeholder="ph.input('dept.deptName')" class="w-45!" clearable />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item :label="t('dept.deptCode')" prop="deptCode">
        <el-input v-model="searchForm.deptCode" :placeholder="ph.input('dept.deptCode')" class="w-45!" clearable />
      </el-form-item>
      <!-- 关联状态 -->
      <el-form-item :label="t('dept.relationStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('dept.relationStatus')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in USER_DEPT_RELATION_STATUS_FILTER_OPTIONS"
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
      :adaptive-config="{ offsetBottom: 32 }"
      :columns="columns"
      :state="deptAssignState"
      :title="`${nickname || username} (${username})`"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group>
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
          <el-button :disabled="!hasSelection" type="danger" @click="deleteBatchRows()">
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
          <el-button type="danger" @click="clearAllDepts">{{ t('buttons.assignClearAll') }}</el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" @click="openEditDialog(row)">{{ t('buttons.actionEdit') }}</el-button>
        <el-button link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
