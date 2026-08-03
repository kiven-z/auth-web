<script lang="ts" setup>
import type { UserDeptPageQuery, UserDeptPageRow } from '@/api/system/user/user-dept';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useUserProfileColumns from '@/components/business/UserProfile/src/useUserProfileColumns';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { AuthorizationSurfacePanelProps } from '@/views/system/_shared/authorization/types';
import useUserOptions from '@/views/system/user/hooks/options/useUserOptions';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserBoundDeptsPanel' });

/** 用户关联部门分页面板 */
type UserBoundDeptsPanelProps = AuthorizationSurfacePanelProps<UserDeptPageRow, UserDeptPageQuery>;

const props = defineProps<UserBoundDeptsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { relationStatusOptions } = useUserOptions();
const { userDeptBindingColumns } = useUserProfileColumns();
const searchFormRef = ref<FormInstance>();

const deptState = usePaginationState<UserDeptPageRow, UserDeptPageQuery>({
  searchForm: reactive({
    deptName: undefined,
    deptCode: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = deptState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="user-bound-depts-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
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
      <el-form-item :label="t('relation.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('relation.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in relationStatusOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button v-perms="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="queryPerm" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable :columns="userDeptBindingColumns" :state="deptState" :title="title" show-overflow-tooltip />
  </div>
</template>
