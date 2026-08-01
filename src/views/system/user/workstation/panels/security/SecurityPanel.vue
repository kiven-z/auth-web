<script lang="ts" setup>
import { getUserProfile } from '@/api/system/user/user-base';
import { hasAuth } from '@/auth/permission';
import { useChangePasswordAction } from '@/components/business/ChangePasswordDialog';
import AccountActionRow from '@/components/ui/AccountActionRow';
import { errorMessage } from '@/services/feedback/message';
import { SYS_USER_PERMS } from '@/views/system/user/constants/permissions';
import useUserMoreAction from '@/views/system/user/workstation/hooks/security/useUserMoreAction';
import AdminSessionsPanel from '@/views/system/user/workstation/panels/security/AdminSessionsPanel.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'UserWorkstationSecurityPanel',
});

const { t } = useI18n();
const route = useRoute();

const loading = ref(false);
const username = ref('');
const sessionsPanelRef = ref<{ loadSessions: () => Promise<void> } | null>(null);

const userId = computed(() => String(route.params.userId ?? ''));

const showActionsSection = computed(
  () => hasAuth(SYS_USER_PERMS.UPDATE) || hasAuth(SYS_USER_PERMS.AUTH_REFRESH) || hasAuth(SYS_USER_PERMS.KICK_ALL)
);

const { openAdminResetPasswordDialog } = useChangePasswordAction();
const { kickAllForUser, refreshUserAuth } = useUserMoreAction();

/**
 * 拉取用户名供弹窗标题与会话字幕
 */
async function loadUsername() {
  if (!userId.value) {
    username.value = '';
    return;
  }

  loading.value = true;
  try {
    const profile = await getUserProfile(userId.value);
    username.value = profile.username;
  } catch (error: unknown) {
    errorMessage(error);
    username.value = '';
  } finally {
    loading.value = false;
  }
}

/**
 * 踢出全部会话并刷新列表
 */
async function handleKickAll() {
  if (!userId.value) {
    return;
  }
  await kickAllForUser(userId.value, {
    successI18nKey: 'users.session.kickAllSuccess',
    onSuccess: () => sessionsPanelRef.value?.loadSessions(),
  });
}

watch(userId, () => void loadUsername(), { immediate: true });
</script>

<template>
  <div v-loading="loading" class="security-panel">
    <section v-if="hasAuth(SYS_USER_PERMS.VIEW_SESSIONS)" class="security-panel__section">
      <el-divider content-position="left">{{ t('account.session.title') }}</el-divider>
      <AdminSessionsPanel ref="sessionsPanelRef" :user-id="userId" :username="username" />
    </section>

    <section v-if="showActionsSection" class="security-panel__section">
      <el-divider content-position="left">{{ t('account.section.accountActions') }}</el-divider>

      <div class="security-panel__actions">
        <AccountActionRow v-if="hasAuth(SYS_USER_PERMS.UPDATE)">
          <template #title>{{ t('users.password.reset') }}</template>
          <template #description>{{ t('users.workstation.security.passwordDesc') }}</template>
          <template #actions>
            <el-button type="primary" @click="openAdminResetPasswordDialog(userId, username)">
              {{ t('users.password.reset') }}
            </el-button>
          </template>
        </AccountActionRow>

        <AccountActionRow v-if="hasAuth(SYS_USER_PERMS.AUTH_REFRESH)">
          <template #title>{{ t('users.workstation.nav.authRefresh') }}</template>
          <template #description>{{ t('users.workstation.security.authRefreshDesc') }}</template>
          <template #actions>
            <el-button type="warning" @click="refreshUserAuth(userId)">
              {{ t('users.workstation.nav.authRefresh') }}
            </el-button>
          </template>
        </AccountActionRow>

        <AccountActionRow v-if="hasAuth(SYS_USER_PERMS.KICK_ALL)">
          <template #title>{{ t('users.session.kickAll') }}</template>
          <template #description>{{ t('users.workstation.security.kickDesc') }}</template>
          <template #actions>
            <el-button type="danger" @click="handleKickAll">
              {{ t('users.session.kickAll') }}
            </el-button>
          </template>
        </AccountActionRow>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.security-panel {
  &__actions {
    display: flex;
    flex-direction: column;

    > .account-action-row + .account-action-row {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }
}
</style>
