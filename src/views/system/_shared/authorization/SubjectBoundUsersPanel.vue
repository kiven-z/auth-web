<script lang="ts" setup>
import type { DeptBoundUserReference, PostBoundUserReference } from '@/api/system/models/grant-table';
import type { DeptUserPageQuery } from '@/api/system/dept/dept-authorization';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useUserProfileColumns } from '@/components/domain/user/UserProfile';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { AuthorizationSurfacePanelProps } from '@/views/system/_shared/authorization/types';
import useUserOptions from '@/views/system/user/hooks/options/useUserOptions';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'SubjectBoundUsersPanel' });

type SubjectBoundUserRow = DeptBoundUserReference | PostBoundUserReference;

/** 主体关联用户分页面板（部门 / 岗位） */
type SubjectBoundUsersPanelProps = AuthorizationSurfacePanelProps<SubjectBoundUserRow, DeptUserPageQuery>;

const props = defineProps<SubjectBoundUsersPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { statusFilterOptions, relationStatusOptions } = useUserOptions();
const { userRelationBindingColumns } = useUserProfileColumns();
const searchFormRef = ref<FormInstance>();

const userState = usePaginationState<SubjectBoundUserRow, DeptUserPageQuery>({
  searchForm: reactive({
    keyword: undefined,
    status: undefined,
    relationStatus: undefined,
    isPrimary: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = userState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="subject-bound-users-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('authorization.surface.keyword')" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          :placeholder="ph.input('authorization.surface.keyword')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('users.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('users.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in statusFilterOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('relation.status')" prop="relationStatus">
        <el-select
          v-model="searchForm.relationStatus"
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
        <el-button v-perms="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-perms="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="userRelationBindingColumns" :state="userState" :title="title" />
  </div>
</template>
