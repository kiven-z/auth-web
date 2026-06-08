<script lang="ts" setup>
import { kickAllUserSessions, kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import AuthDataTable from '@/components/ui/AuthDataTable';
import { operationConfirm } from '@/ui/feedback/dialog';
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
  const confirmed = await operationConfirm();
  if (!confirmed) {
    return;
  }

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

/**
 * 踢出该用户全部会话并刷新列表
 */
async function handleKickAllSessions() {
  const confirmed = await operationConfirm();
  if (!confirmed) {
    return;
  }

  kickingAll.value = true;
  try {
    await kickAllUserSessions(props.userId);
    message(t('users.sessionKickAllSuccess'), { type: 'success' });
    await loadSessions();
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'users.sessionKickAllFailed' });
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
      <span class="text-sm text-(--el-text-color-secondary)">
        {{ t('users.sessionDialogSubtitle', { username }) }}
      </span>

      <div class="flex items-center gap-2">
        <el-button
          :disabled="sessions.length <= 0"
          :loading="kickingAll"
          link
          type="danger"
          @click="handleKickAllSessions"
        >
          {{ t('users.sessionKickAll') }}
        </el-button>
        <el-button :loading="loading" link type="primary" @click="loadSessions">
          {{ t('tableBar.tippyRefresh') }}
        </el-button>
      </div>
    </div>

    <el-empty v-if="!loading && sessions.length <= 0" :description="t('users.sessionEmpty')" />

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
          {{ t('users.sessionKickOne') }}
        </el-button>
      </template>
    </AuthDataTable>
  </div>
</template>
