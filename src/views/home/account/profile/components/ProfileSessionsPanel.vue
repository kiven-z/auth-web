<script lang="tsx" setup>
import { kickMySession, listMySessions, type MeUserSession } from '@/api/system/user-me';
import AuthDataTable from '@/components/ui/AuthDataTable';
import { errorMessage, message } from '@/services/feedback/message';
import useMeSessionTableColumns from '@/views/home/account/profile/hooks/useMeSessionTableColumns';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileSessionsPanel',
});

const props = defineProps<{
  sessions: MeUserSession[];
}>();

const emit = defineEmits<{
  'update:sessions': [sessions: MeUserSession[]];
}>();

const { t } = useI18n();
const { meSessionTableColumns } = useMeSessionTableColumns();
const revokingSessionId = ref<string | null>(null);

const sessionList = computed(() => props.sessions);

/**
 * 当前会话行高亮
 * @param param 行参数
 * @returns 行样式类名
 */
const resolveSessionRowClassName = ({ row }) => (row.current ? 'session-row--current' : '');

/**
 * 下线指定会话并刷新列表
 * @param sessionId 会话 ID
 */
async function handleRevokeSession(sessionId: string) {
  revokingSessionId.value = sessionId;
  try {
    await kickMySession(sessionId);
    message(t('account.message.revokeSuccess'), { type: 'success' });
    emit('update:sessions', await listMySessions());
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'users.session.kickFailed' });
  } finally {
    revokingSessionId.value = null;
  }
}
</script>

<template>
  <div class="profile-sessions-panel">
    <el-text class="mb-3 block" type="info">{{ t('account.session.subtitle') }}</el-text>

    <el-empty v-if="sessionList.length <= 0" :description="t('users.session.empty')" />
    <AuthDataTable
      v-else
      :adaptive="false"
      :columns="meSessionTableColumns"
      :data="sessionList"
      :row-class-name="resolveSessionRowClassName"
      border
      row-key="sessionId"
      show-overflow-tooltip
      size="small"
    >
      <template #actions="{ row }">
        <el-button
          v-if="!row.current"
          :loading="revokingSessionId === row.sessionId"
          link
          type="danger"
          @click="handleRevokeSession(row.sessionId)"
        >
          {{ t('account.session.revoke') }}
        </el-button>
      </template>
    </AuthDataTable>
  </div>
</template>

<style lang="scss" scoped>
:deep(.session-row--current) {
  background-color: var(--el-color-primary-light-9);

  td {
    background-color: var(--el-color-primary-light-9) !important;
  }
}
</style>
