<script lang="ts" setup>
import { getOnlineUserPage, type OnlineUserPageRow } from '@/api/auth/online-user';
import AuthPagedTable, { usePaginationState } from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/shared/composables/dialog/useRemoteUserSearch';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_ONLINE_USER_PERMS } from '@/views/system/online-user/constants/permissions';
import useOnlineUserTableAction from '@/views/system/online-user/hooks/useOnlineUserTableAction';
import useOnlineUserTableColumns from '@/views/system/online-user/hooks/useOnlineUserTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemOnlineUser',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useOnlineUserTableColumns();
const searchFormRef = ref<FormInstance>();

const searchForm = reactive({
  userId: undefined as string,
});

const tableState = usePaginationState<OnlineUserPageRow & { id: string }>({
  searchForm,
  errorI18nKey: 'onlineUser.message.loadFailed',
  defaultPageSize: 30,
  fetchApi: async (params) => {
    const page = await getOnlineUserPage(params);
    const list = (page.list ?? []).map((row) => ({
      ...row,
      id: row.userId,
    }));
    return { ...page, list };
  },
});
const { loading, fetchTableData, pagination } = tableState;

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'onlineUser.message.loadFailed',
});

const { kickingUserId, openViewSessionsDialog, kickAllSessionsRow } = useOnlineUserTableAction({
  fetchTableData,
});

/**
 * 重置搜索并刷新
 * @param formRef 搜索表单
 */
async function handleResetSearch(formRef?: FormInstance) {
  tableState.pagination.currentPage = 1;
  formRef?.resetFields();
  await fetchTableData();
}

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form ref="searchFormRef" :model="searchForm" class="bg-bg_color w-[99/100] overflow-auto pl-8 pt-3" inline>
      <!-- 用户 -->
      <el-form-item :label="t('onlineUser.field.user')" prop="userId">
        <el-select
          v-model="searchForm.userId"
          :loading="userSearchLoading"
          :placeholder="ph.keyword('onlineUser.field.user')"
          :remote-method="loadUserListByKeyword"
          class="w-45!"
          clearable
          filterable
          remote
        >
          <el-option v-for="item in userOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <!-- 搜索 -->
          <el-button v-perms="SYS_ONLINE_USER_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button v-perms="SYS_ONLINE_USER_PERMS.QUERY" @click="handleResetSearch(searchFormRef)">
            {{ t('buttons.actionReset') }}
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <AuthPagedTable
      :columns="columns"
      :state="tableState"
      :title="t('routes.onlineUser')"
      row-key="userId"
      show-overflow-tooltip
    >
      <template #title>
        <h4>{{ t('routes.onlineUser') }}</h4>
        <el-text v-if="!loading" class="ml-3!" type="info">
          {{ t('onlineUser.summary.userCount', { count: pagination.total }) }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <el-button
          v-perms="SYS_ONLINE_USER_PERMS.VIEW_SESSIONS"
          link
          type="primary"
          @click="openViewSessionsDialog(row)"
        >
          {{ t('onlineUser.action.viewSessions') }}
        </el-button>
        <el-button
          v-perms="SYS_ONLINE_USER_PERMS.KICK_ALL"
          :loading="kickingUserId === row.userId"
          link
          type="danger"
          @click="kickAllSessionsRow(row)"
        >
          {{ t('onlineUser.action.kickAll') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
