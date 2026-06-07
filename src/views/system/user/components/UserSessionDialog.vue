<script lang="ts" setup>
import { kickUserSession, listUserSessions, type UserSessionIndex } from '@/api/auth/session';
import { errorMessage, message } from '@/ui/feedback/message';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  userId: string;
  username: string;
}>();

const { t } = useI18n();

const loading = ref(false);
const kickingSessionId = ref<string | null>(null);
const sessions = ref<UserSessionIndex[]>([]);

/**
 * 格式化 Refresh Token 过期时间
 * @param value 毫秒时间戳
 * @returns 展示文案
 */
function formatExpiresAt(value: number | null | undefined): string {
  if (value == null || value <= 0) {
    return '—';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

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

    <el-table v-loading="loading" :data="sessions" border row-key="sessionId" size="small">
      <!-- 设备 -->
      <el-table-column :label="t('users.sessionDevice')" min-width="90" prop="deviceType" show-overflow-tooltip />
      <!-- 浏览器 -->
      <el-table-column :label="t('users.sessionBrowser')" min-width="100" prop="browserType" show-overflow-tooltip />
      <!-- 操作系统 -->
      <el-table-column :label="t('users.sessionOs')" min-width="100" prop="osType" show-overflow-tooltip />
      <!-- IP -->
      <el-table-column :label="t('users.lastLoginIp')" min-width="120" prop="ipAddress" show-overflow-tooltip />
      <!-- 地区 -->
      <el-table-column :label="t('users.lastLoginRegion')" min-width="120" prop="ipRegion" show-overflow-tooltip />
      <!-- 记住我 -->
      <el-table-column :label="t('users.sessionRememberMe')" min-width="80">
        <template #default="{ row }">
          {{ row.rememberMe ? t('status.yes') : t('status.no') }}
        </template>
      </el-table-column>
      <!-- 过期时间 -->
      <el-table-column :label="t('users.sessionExpiresAt')" min-width="160">
        <template #default="{ row }">
          {{ formatExpiresAt(row.refreshTokenExpiresAt) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="t('table.actions')" fixed="right" min-width="90">
        <template #default="{ row }">
          <el-button
            :loading="kickingSessionId === row.sessionId"
            link
            type="danger"
            @click="handleKickSession(row.sessionId)"
          >
            {{ t('users.sessionKickOne') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
