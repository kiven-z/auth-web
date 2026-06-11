<script lang="ts" setup>
import type { FormOverlayExpose } from '@/composables/table/useFormOverlaySubmit';
import { useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import { createUserDept, getUserDeptPage, type UserDeptAssignForm, type UserDeptPageRow } from '@/api/system/user-dept';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { addDialog } from '@/components/ui/Dialog';
import { USER_DEPT_RELATION_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-dept-relation-status';
import UserDeptAssignFormDialog from '@/views/system/user/components/UserDeptAssignFormDialog.vue';
import useUserDeptAssignTableColumns from '@/views/system/user/hooks/columns/useUserDeptAssignTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserAssignDeptDrawer' });

const props = defineProps<{
  userId: string;
  username: string;
  nickname?: string | null;
}>();

const { t } = useI18n();
const { createFormBeforeSure } = useFormOverlaySubmit();
const searchFormRef = ref<FormInstance>();
const { columns } = useUserDeptAssignTableColumns();

const displayName = computed(() => props.nickname || props.username);

const deptAssignState = usePaginationState<UserDeptPageRow>({
  searchForm: reactive({
    deptName: undefined,
    deptCode: undefined,
    status: undefined,
  }),
  defaultPageSize: 30,
  errorI18nKey: 'users.deptAssignLoadFailed',
  fetchApi: (query) =>
    getUserDeptPage(props.userId, {
      pageIndex: query.pageIndex as number,
      pageSize: query.pageSize as number,
      deptName: query.deptName as string,
      deptCode: query.deptCode as string,
      status: query.status as number,
    }),
});

const { loading, searchForm, fetchTableData, resetQuery } = deptAssignState;

/**
 * 打开新增部门关联弹窗
 */
const openCreateDialog = () => {
  const dialogFormRef = ref<FormOverlayExpose<UserDeptAssignForm> | null>(null);

  addDialog({
    title: t('users.deptAssignCreateTitle'),
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    contentRenderer: () => h(UserDeptAssignFormDialog, { ref: dialogFormRef }),
    beforeSure: createFormBeforeSure<UserDeptAssignForm>({
      formExposeRef: dialogFormRef,
      errorI18nKey: 'users.deptAssignSaveFailed',
      successI18nKey: 'tips.addSuccess',
      onSubmit: async (formPayload) => {
        await createUserDept(props.userId, formPayload);
        await fetchTableData();
      },
    }),
  });
};

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="flex flex-col">
    <el-form ref="searchFormRef" :model="searchForm" class="pl-6" inline>
      <!-- 部门名称 -->
      <el-form-item :label="t('dept.deptName')" prop="deptName">
        <el-input v-model="searchForm.deptName" :placeholder="t('dept.deptName')" class="w-45!" clearable />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item :label="t('dept.deptCode')" prop="deptCode">
        <el-input v-model="searchForm.deptCode" :placeholder="t('dept.deptCode')" class="w-45!" clearable />
      </el-form-item>
      <!-- 关联状态 -->
      <el-form-item :label="t('dept.relationStatus')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="t('dept.relationStatus')" class="w-45!" clearable>
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
      :title="`${displayName} (${username})`"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
