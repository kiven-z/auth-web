<script lang="ts" setup>
import { kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import AuthDataTable from '@/components/ui/AuthDataTable';
import { operationConfirm } from '@/ui/feedback/dialog';
import { errorMessage, message } from '@/ui/feedback/message';
import useUserSessionTableColumns from '@/views/system/user/hooks/columns/useUserSessionTableColumns';
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
    errorMessage(error, { defaultI18nKey: 'users.session.loadFailed' });
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
    errorMessage(error, { defaultI18nKey: 'users.session.kickFailed' });
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
      failedI18nKey: 'users.session.kickAllFailed',
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
          :disabled="sessions.length <= 0"
          :loading="kickingAll"
          link
          type="danger"
          @click="handleKickAllSessions"
        >
          {{ t('users.session.kickAll') }}
        </el-button>
        <el-button :loading="loading" link type="primary" @click="loadSessions">
          {{ t('tableBar.refresh') }}
        </el-button>
      </div>
    </div>

    <el-empty v-if="!loading && sessions.length <= 0" :description="t('users.session.empty')" />

    <AuthDataTable
      v-else
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
          {{ t('users.session.kickOne') }}
        </el-button>
      </template>
    </AuthDataTable>
  </div>
</template>
