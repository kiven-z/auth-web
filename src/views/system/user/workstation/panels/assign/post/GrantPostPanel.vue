<script lang="ts" setup>
import PagedTable, { usePaginationState } from '@/components/table/PagedTable';
import { getUserProfile } from '@/api/system/user/user-base';
import { getUserPostPage, type UserPostPageQuery, type UserPostPageRow } from '@/api/system/user/user-post';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_USER_POST_PERMS } from '@/views/system/user/constants/permissions';
import useUserOptions from '@/views/system/user/hooks/options/useUserOptions';
import useGrantPostAction from '@/views/system/user/workstation/hooks/post/useGrantPostAction';
import useUserPostAssignTableColumns from '@/views/system/user/workstation/hooks/post/useUserPostAssignTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({ name: 'UserWorkstationGrantPostPanel' });

const route = useRoute();
const { t } = useI18n();
const ph = useFormPlaceholder();
const { relationStatusOptions } = useUserOptions();

const userId = computed(() => String(route.params.userId ?? ''));
const username = ref('');
const nickname = ref('');
const searchFormRef = ref<FormInstance>();

const postAssignState = usePaginationState<UserPostPageRow, UserPostPageQuery>({
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
    status: undefined,
  }),
  fetchApi: (query) => getUserPostPage(userId.value, query),
});
const { fetchTableData, resetQuery, loading, searchForm, selectedRows } = postAssignState;

const { openCreateDialog, openEditDialog, deleteBatchRows, clearAllPosts } = useGrantPostAction({
  userId: userId.value,
  fetchTableData,
  selectedRows,
});

const hasSelection = computed(() => selectedRows.value.length > 0);
const tableTitle = computed(() => `${nickname.value || username.value} (${username.value})`);

const { columns } = useUserPostAssignTableColumns();

/**
 * 拉取用户名用于表格标题
 */
async function loadUserTitle() {
  if (!userId.value) {
    return;
  }
  try {
    const profile = await getUserProfile(userId.value);
    username.value = profile.username;
    nickname.value = profile.nickname;
  } catch (error: unknown) {
    errorMessage(error);
    username.value = '';
    nickname.value = '';
  }
}

watch(
  userId,
  () => {
    void loadUserTitle();
    void fetchTableData();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col">
    <el-alert :title="t('users.postAssign.panelTip')" closable show-icon type="info" />
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-6" inline>
      <el-form-item :label="t('post.field.postCode')" prop="postCode">
        <el-input
          v-model="searchForm.postCode"
          :placeholder="ph.input('post.field.postCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.postName')" prop="postName">
        <el-input
          v-model="searchForm.postName"
          :placeholder="ph.input('post.field.postName')"
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
          <el-button v-perms="SYS_USER_POST_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <el-button v-perms="SYS_USER_POST_PERMS.QUERY" @click="resetQuery(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <PagedTable :columns="columns" :state="postAssignState" :title="tableTitle">
      <template #buttons>
        <el-button-group>
          <el-button v-perms="SYS_USER_POST_PERMS.CREATE" type="primary" @click="openCreateDialog">
            {{ t('buttons.actionAdd') }}
          </el-button>
          <el-button
            v-perms="SYS_USER_POST_PERMS.DELETE"
            :disabled="!hasSelection"
            type="danger"
            @click="deleteBatchRows()"
          >
            {{ t('buttons.actionBatchDelete') }}
          </el-button>
          <el-button v-perms="SYS_USER_POST_PERMS.DELETE" type="danger" @click="clearAllPosts">
            {{ t('buttons.assignClearAll') }}
          </el-button>
        </el-button-group>
      </template>

      <template #actions="{ row }">
        <el-button v-perms="SYS_USER_POST_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
          {{ t('buttons.actionEdit') }}
        </el-button>
        <el-button v-perms="SYS_USER_POST_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </PagedTable>
  </div>
</template>
