<script lang="ts" setup>
import { getOnlineSessionSummary } from '@/api/auth/online-session';
import AuthPagedTable from '@/components/business/AuthPagedTable';
import { useFormPlaceholder } from '@/composables/i18n/useFormPlaceholder';
import { errorMessage } from '@/ui/feedback/message';
import useOnlineSessionPageState from '@/views/system/online-user/hooks/useOnlineSessionPageState';
import useOnlineSessionTableAction from '@/views/system/online-user/hooks/useOnlineSessionTableAction';
import useOnlineSessionTableColumns from '@/views/system/online-user/hooks/useOnlineSessionTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemOnlineUser',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const { columns } = useOnlineSessionTableColumns();
const searchFormRef = ref<FormInstance>();
const summarySessionCount = ref<number | null>(null);
const summaryLoading = ref(false);

const { tableState, searchForm } = useOnlineSessionPageState();
const { loading, fetchTableData: fetchOnlineSessionPage } = tableState;

/**
 * 拉取在线会话统计摘要
 */
async function loadSessionSummary() {
  summaryLoading.value = true;
  try {
    const summary = await getOnlineSessionSummary();
    summarySessionCount.value = summary.sessionCount ?? 0;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'onlineUser.message.summaryFailed' });
    summarySessionCount.value = null;
  } finally {
    summaryLoading.value = false;
  }
}

/**
 * 刷新列表并同步统计摘要（表格工具栏刷新、踢人后复用）
 */
async function refreshTableAndSummary() {
  await Promise.all([fetchOnlineSessionPage(), loadSessionSummary()]);
}

tableState.fetchTableData = refreshTableAndSummary;

const { kickingSessionId, kickSessionRow } = useOnlineSessionTableAction({
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
      <!-- 用户名 -->
      <el-form-item :label="t('onlineUser.field.username')" prop="username">
        <el-input
          v-model="searchForm.username"
          :placeholder="ph.input('onlineUser.field.username')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <!-- IP 地址 -->
      <el-form-item :label="t('onlineUser.field.ipAddress')" prop="ipAddress">
        <el-input
          v-model="searchForm.ipAddress"
          :placeholder="ph.input('onlineUser.field.ipAddress')"
          class="w-45!"
          clearable
        />
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
      row-key="sessionId"
      show-overflow-tooltip
    >
      <template #title>
        <span>{{ t('routes.onlineUser') }}</span>
        <el-text v-if="summarySessionCount != null" class="ml-3!" type="info">
          {{ t('onlineUser.summary.sessionCount', { count: summarySessionCount }) }}
        </el-text>
        <el-text v-else-if="summaryLoading" class="ml-3!" type="info">…</el-text>
      </template>

      <template #actions="{ row }">
        <el-button :loading="kickingSessionId === row.sessionId" link type="danger" @click="kickSessionRow(row)">
          {{ t('onlineUser.action.kickOne') }}
        </el-button>
      </template>
    </AuthPagedTable>
  </div>
</template>
