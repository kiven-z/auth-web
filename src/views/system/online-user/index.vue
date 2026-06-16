<script lang="ts" setup>
import { getOnlineUserSummary } from '@/api/auth/online-user';
import AuthPagedTable from '@/components/business/AuthPagedTable';
import useRemoteUserSearch from '@/composables/dialog/useRemoteUserSearch';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { errorMessage } from '@/ui/feedback/message';
import useOnlineUserPageState from '@/views/system/online-user/hooks/useOnlineUserPageState';
import useOnlineUserTableAction from '@/views/system/online-user/hooks/useOnlineUserTableAction';
import useOnlineUserTableColumns from '@/views/system/online-user/hooks/useOnlineUserTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemOnlineUser',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useOnlineUserTableColumns();
const searchFormRef = ref<FormInstance>();
const summaryUserCount = ref<number | null>(null);
const summaryLoading = ref(false);

const { tableState, searchForm } = useOnlineUserPageState();
const { loading, fetchTableData: fetchOnlineUserPage } = tableState;

const { userOptions, userSearchLoading, loadUserListByKeyword } = useRemoteUserSearch({
  errorDefaultI18nKey: 'onlineUser.message.loadFailed',
});

/**
 * 拉取在线用户统计摘要
 */
async function loadUserSummary() {
  summaryLoading.value = true;
  try {
    const summary = await getOnlineUserSummary();
    summaryUserCount.value = summary.onlineUserCount ?? 0;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'onlineUser.message.summaryFailed' });
    summaryUserCount.value = null;
  } finally {
    summaryLoading.value = false;
  }
}

/**
 * 刷新列表并同步统计摘要（表格工具栏刷新、踢人后复用）
 */
async function refreshTableAndSummary() {
  await Promise.all([fetchOnlineUserPage(), loadUserSummary()]);
}

tableState.fetchTableData = refreshTableAndSummary;

const { kickingUserId, openViewSessionsDialog, kickAllSessionsRow } = useOnlineUserTableAction({
  fetchTableData: refreshTableAndSummary,
});

/**
 * 重置搜索并刷新
 * @param formRef 搜索表单
 */
async function handleResetSearch(formRef?: FormInstance) {
  tableState.pagination.currentPage = 1;
  formRef?.resetFields();
  await refreshTableAndSummary();
}

onMounted(() => {
  refreshTableAndSummary();
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
          <el-button :loading="loading" type="primary" @click="refreshTableAndSummary">
            {{ t('buttons.actionSearch') }}
          </el-button>
          <!-- 重置 -->
          <el-button @click="handleResetSearch(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
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
        <el-text v-if="summaryUserCount != null" class="ml-3!" type="info">
          {{ t('onlineUser.summary.userCount', { count: summaryUserCount }) }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" @click="openViewSessionsDialog(row)">
          {{ t('onlineUser.action.viewSessions') }}
        </el-button>
        <el-button :loading="kickingUserId === row.userId" link type="danger" @click="kickAllSessionsRow(row)">
          {{ t('onlineUser.action.kickAll') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
