<script lang="ts" setup>
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import { getUserPostPage, type UserPostPageRow } from '@/api/system/user-post';
import useUserAssignPostDrawerAction from '@/views/system/user/hooks/actions/useUserAssignPostDrawerAction';
import useUserPostAssignTableColumns from '@/views/system/user/hooks/columns/useUserPostAssignTableColumns';
import { USER_DEPT_RELATION_STATUS_FILTER_OPTIONS } from '@/views/system/user/constants/user-dept-relation-status';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserAssignPostDrawer' });

const props = defineProps<{
  userId: string;
  username: string;
  nickname?: string | null;
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();

const searchFormRef = ref<FormInstance>();

const postAssignState = usePaginationState<UserPostPageRow>({
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
    status: undefined,
  }),
  defaultPageSize: 30,
  errorI18nKey: 'tips.assignLoadFailed',
  fetchApi: (query) =>
    getUserPostPage(props.userId, {
      pageIndex: query.pageIndex as number,
      pageSize: query.pageSize as number,
      postCode: query.postCode as string,
      postName: query.postName as string,
      status: query.status as number,
    }),
});
const { fetchTableData, resetQuery, loading, searchForm, selectedRows } = postAssignState;

const { openCreateDialog, openEditDialog, deleteBatchRows, clearAllPosts } = useUserAssignPostDrawerAction({
  userId: props.userId,
  fetchTableData,
  selectedRows,
});

const hasSelection = computed(() => selectedRows.value.length > 0);

const { columns } = useUserPostAssignTableColumns();

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div class="flex flex-col">
    <el-alert :title="t('users.postAssign.drawerTip')" closable show-icon type="info" />
    <el-form ref="searchFormRef" :model="searchForm" class="pt-2 pl-6" inline>
      <!-- 岗位编码 -->
      <el-form-item :label="t('post.postCode')" prop="postCode">
        <el-input v-model="searchForm.postCode" :placeholder="ph.input('post.postCode')" class="w-45!" clearable />
      </el-form-item>
      <!-- 岗位名称 -->
      <el-form-item :label="t('post.postName')" prop="postName">
        <el-input v-model="searchForm.postName" :placeholder="ph.input('post.postName')" class="w-45!" clearable />
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
            v-for="option in USER_DEPT_RELATION_STATUS_FILTER_OPTIONS"
            :key="`${option.labelKey}:${String(option.value)}`"
            :label="t(option.labelKey)"
            :value="option.value"
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
      :state="postAssignState"
      :title="`${nickname || username} (${username})`"
      show-overflow-tooltip
    >
      <template #buttons>
        <el-button-group>
          <el-button type="primary" @click="openCreateDialog">{{ t('buttons.actionAdd') }}</el-button>
          <el-button :disabled="!hasSelection" type="danger" @click="deleteBatchRows()">
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
          <el-button type="danger" @click="clearAllPosts">{{ t('buttons.assignClearAll') }}</el-button>
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
