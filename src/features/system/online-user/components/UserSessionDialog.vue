<script lang="ts" setup>
import { kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import DataTable from '@/components/table/DataTable';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useUserSessionTableColumns from '@/features/system/_shared/columns/useUserSessionTableColumns';
import { SYS_SESSION_PERMS } from '@/features/system/_shared/constants/session-permissions';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  userId: string;
  username: string;
  kickAllForUser: Function;
}>();

const { t } = useI18n();
const { columns } = useUserSessionTableColumns();

const loading = ref(false);
const kickingAll = ref(false);
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
    errorMessage(error);
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
  const confirmed = await operationConfirm();
  if (!confirmed) {
    return;
  }

  kickingSessionId.value = sessionId;
  try {
    await kickUserSession(props.userId, sessionId);
    message(t('users.session.kickSuccess'), { type: 'success' });
    await loadSessions();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    kickingSessionId.value = null;
  }
}

/**
 * 踢出该用户全部会话并刷新列表
 */
async function handleKickAllSessions() {
  kickingAll.value = true;
  try {
    await props.kickAllForUser(props.userId, {
      successI18nKey: 'users.session.kickAllSuccess',
      onSuccess: loadSessions,
    });
  } finally {
    kickingAll.value = false;
  }
}

onMounted(() => {
  loadSessions();
});
</script>

<template>
  <div class="user-session-dialog">
    <div class="mb-3 flex items-center justify-between gap-2">
      <el-text type="info">
        {{ t('users.session.subtitle', { username }) }}
      </el-text>

      <div class="flex items-center gap-2">
        <el-button
          v-auth="SYS_SESSION_PERMS.KICK_ALL"
          :disabled="sessions.length <= 0"
          :loading="kickingAll"
          link
          type="danger"
          @click="handleKickAllSessions"
        >
          {{ t('users.session.kickAll') }}
        </el-button>
        <el-button
          v-auth="SYS_SESSION_PERMS.VIEW_SESSIONS"
          :loading="loading"
          link
          type="primary"
          @click="loadSessions"
        >
          {{ t('listTable.refresh') }}
        </el-button>
      </div>
    </div>

    <el-empty v-if="!loading && sessions.length <= 0" :description="t('users.session.empty')" />

    <DataTable v-else :columns="columns" :data="sessions" :loading="loading" border row-key="sessionId" size="small">
      <template #actions="{ row }">
        <el-button
          v-auth="SYS_SESSION_PERMS.KICK_SESSION"
          :loading="kickingSessionId === row.sessionId"
          link
          type="danger"
          @click="handleKickSession(row.sessionId)"
        >
          {{ t('users.session.kickOne') }}
        </el-button>
      </template>
    </DataTable>
  </div>
</template>
