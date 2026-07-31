<script lang="ts" setup>
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { SYS_USER_DEPT_PERMS } from '@/views/system/user/constants/permissions';
import { USER_DEPT_RELATION_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-dept-relation-status';
import useUserAssignDeptDrawerAction from '@/views/system/user/hooks/actions/useUserAssignDeptDrawerAction';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserDeptAssignTableColumns from '@/views/system/user/hooks/columns/useUserDeptAssignTableColumns';
import { getUserDeptPage, UserDeptPageRow } from '@/api/system/user/user-dept';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
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
    <el-alert :title="t('users.deptAssign.drawerTip')" closable show-icon type="info" />
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-6" inline>
      <!-- 部门名称 -->
      <el-form-item :label="t('dept.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('dept.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
        <el-input
          v-model="searchForm.deptCode"
          :placeholder="ph.input('dept.field.deptCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- 关联状态 -->
      <el-form-item :label="t('relation.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('relation.status')"
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
          <el-button v-perms="SYS_USER_DEPT_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_USER_DEPT_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
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
          <el-button v-perms="SYS_USER_DEPT_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>
          <el-button
            v-perms="SYS_USER_DEPT_PERMS.DELETE"
            :disabled="!hasSelection"
            type="danger"
            @click="deleteBatchRows()"
          >
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
          <el-button v-perms="SYS_USER_DEPT_PERMS.DELETE" type="danger" @click="clearAllDepts">
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_USER_DEPT_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_USER_DEPT_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
