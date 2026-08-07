<script lang="ts" setup>
import { kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import DataTable from '@/components/table/DataTable';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import useUserSessionTableColumns from '@/views/system/_shared/columns/useUserSessionTableColumns';
import { SYS_SESSION_PERMS } from '@/views/system/_shared/session/session-permissions';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AdminSessionsPanel',
});

const props = defineProps<{
  /** 目标用户 ID */
  userId: string;
  /** 目标用户名（字幕展示） */
  username: string;
}>();

const { t } = useI18n();
const { columns } = useUserSessionTableColumns();

const loading = ref(false);
const kickingSessionId = ref<string | null>(null);
const sessions = ref<UserSessionIndex[]>([]);

const subtitle = computed(() => t('users.session.subtitle', { username: props.username || '—' }));

/**
 * 拉取活跃会话列表
 */
async function loadSessions() {
  if (!props.userId) {
    sessions.value = [];
    return;
  }

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

watch(
  () => props.userId,
  () => void loadSessions(),
  { immediate: true }
);

defineExpose({ loadSessions });
</script>

<template>
  <div v-loading="loading" class="admin-sessions-panel">
    <div class="admin-sessions-panel__toolbar">
      <el-text type="info">{{ subtitle }}</el-text>
      <el-button v-perms="SYS_SESSION_PERMS.VIEW_SESSIONS" :loading="loading" link type="primary" @click="loadSessions">
        {{ t('tableBar.refresh') }}
      </el-button>
    </div>

    <el-empty v-if="!loading && sessions.length <= 0" :description="t('users.session.empty')" />
    <DataTable v-else :columns="columns" :data="sessions" border row-key="sessionId">
      <template #actions="{ row }">
        <el-button
          v-perms="SYS_SESSION_PERMS.KICK_SESSION"
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

<style lang="scss" scoped>
.admin-sessions-panel {
  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
</style>
