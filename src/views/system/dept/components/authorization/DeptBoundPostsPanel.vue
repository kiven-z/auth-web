<script lang="ts" setup>
import type { PostReference } from '@/api/system/_shared/grant-table';
import type { DeptPostPageQuery } from '@/api/system/dept/dept-authorization';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import type { AuthorizationSurfacePanelProps } from '@/views/system/_shared/authorization/types';
import usePostColumns from '@/views/system/dept/hooks/columns/usePostColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptBoundPostsPanel' });

/** 部门下属岗位分页面板 */
type DeptBoundPostsPanelProps = AuthorizationSurfacePanelProps<PostReference, DeptPostPageQuery>;

const props = defineProps<DeptBoundPostsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { postColumns } = usePostColumns();
const searchFormRef = ref<FormInstance>();

const postState = usePaginationState<PostReference, DeptPostPageQuery>({
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = postState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="dept-bound-posts-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('post.field.postName')" prop="postName">
        <el-input
          v-model="searchForm.postName"
          :placeholder="ph.input('post.field.postName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.postCode')" prop="postCode">
        <el-input
          v-model="searchForm.postCode"
          :placeholder="ph.input('post.field.postCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('post.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in booleanStatusOptions"
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

    <AuthPagedTable :columns="postColumns" :state="postState" :title="title" show-overflow-tooltip />
  </div>
</template>
