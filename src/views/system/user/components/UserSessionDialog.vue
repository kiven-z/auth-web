<script lang="ts" setup>
import { kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import AuthDataTable from '@/components/ui/AuthDataTable';
import { errorMessage, message } from '@/ui/feedback/message';
import useUserSessionTableColumns from '@/views/system/user/hooks/useUserSessionTableColumns';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  userId: string;
  username: string;
}>();

const { t } = useI18n();
const { columns } = useUserSessionTableColumns();

const loading = ref(false);
const kickingSessionId = ref<string | null>(null);
const sessions = ref<UserSessionIndex[]>([]);

/**
 * 拉取活跃会话列表
 */
async function loadSessions() {
  loading.value = true;
  try {
    sessions.value = await listUserSessions(props.userId);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'users.sessionLoadFailed' });
    sessions.value = [];
  } finally {
    loading.value = false;
  }
}

/**
 * 踢出单条会话并刷新列表
 * @param sessionId 会话 ID
 */
async function handleKickSession(sessionId: string) {
  kickingSessionId.value = sessionId;
  try {
    await kickUserSession(props.userId, sessionId);
    message(t('users.sessionKickSuccess'), { type: 'success' });
    await loadSessions();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'users.sessionKickFailed' });
  } finally {
    kickingSessionId.value = null;
  }
}

onMounted(() => {
  loadSessions();
});
</script>

<template>
  <div class="user-session-dialog">
    <div class="mb-3 flex items-center justify-between gap-2">
      <span class="text-sm text-(--el-text-color-secondary)">
        {{ t('users.sessionDialogSubtitle', { username }) }}
      </span>
      <el-button :loading="loading" link type="primary" @click="loadSessions">
        {{ t('tableBar.tippyRefresh') }}
      </el-button>
    </div>

    <AuthDataTable
      :adaptive="false"
      :columns="columns"
      :data="sessions"
      :loading="loading"
      border
      row-key="sessionId"
      show-overflow-tooltip
      size="small"
    >
      <template #actions="{ row }">
        <el-button
          :loading="kickingSessionId === row.sessionId"
          link
          type="danger"
          @click="handleKickSession(row.sessionId)"
        >
          {{ t('users.sessionKickOne') }}
        </el-button>
      </template>
    </AuthDataTable>
  </div>
</template>
