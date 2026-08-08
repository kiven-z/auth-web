<script lang="ts" setup>
import type { UserPostPageQuery, UserPostPageRow } from '@/api/system/user/user-post';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useUserProfileColumns } from '@/components/domain/user/UserProfile';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { AuthorizationSurfacePanelProps } from '@/views/system/_shared/authorization/types';
import useUserOptions from '@/views/system/user/hooks/options/useUserOptions';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserBoundPostsPanel' });

/** 用户-岗位关联分页面板 */
type UserBoundPostsPanelProps = AuthorizationSurfacePanelProps<UserPostPageRow, UserPostPageQuery>;

const props = defineProps<UserBoundPostsPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const { relationStatusOptions } = useUserOptions();
const { userPostBindingColumns } = useUserProfileColumns();
const searchFormRef = ref<FormInstance>();

const postState = usePaginationState<UserPostPageRow, UserPostPageQuery>({
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
  <div class="user-bound-posts-panel">
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
        <el-button v-perms="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-perms="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="userPostBindingColumns" :state="postState" :title="title" />
  </div>
</template>
