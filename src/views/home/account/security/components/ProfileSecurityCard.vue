<script lang="ts" setup>
import { clearMyPreferences } from '@/api/system/user/user-preferences';
import { getConfig } from '@/auth/config';
import { resetLocalUiPreferences } from '@/core/preferences/storage';
import { useChangePasswordAction } from '@/components/business/ChangePasswordDialog';
import AccountActionRow from '@/components/ui/AccountActionRow';
import { multiConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileSecurityCard',
});

const { t } = useI18n();
const resetting = ref(false);

const { openSelfChangePasswordDialog } = useChangePasswordAction();

/**
 * 二次确认后清空服务端 UI 偏好、重置本地 storage 并刷新页面
 */
async function handleResetPreferences() {
  const confirmed = await multiConfirm([
    {
      title: t('account.preferences.confirmFirst'),
      message: t('account.preferences.title'),
    },
  ]);
  if (!confirmed) {
    return;
  }

  resetting.value = true;
  try {
    await clearMyPreferences();
    const config = getConfig();
    resetLocalUiPreferences({
      locale: { locale: config.Locale ?? 'zh' },
      layout: {
        layout: config.Layout ?? 'vertical',
        theme: config.Theme ?? 'light',
        darkMode: config.DarkMode ?? false,
        sidebarStatus: config.SidebarStatus ?? true,
        epThemeColor: config.EpThemeColor ?? '#409EFF',
        themeColor: config.Theme ?? 'light',
        overallStyle: config.OverallStyle ?? 'light',
      },
      configure: {
        grey: config.Grey ?? false,
        weak: config.Weak ?? false,
        hideTabs: config.HideTabs ?? false,
        hideFooter: config.HideFooter ?? true,
        showLogo: config.ShowLogo ?? true,
        showModel: config.ShowModel ?? 'smart',
        multiTagsCache: config.MultiTagsCache ?? false,
        stretch: config.Stretch ?? false,
      },
    });
    message(t('account.preferences.resetSuccess'), { type: 'success' });
    window.location.reload();
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    resetting.value = false;
  }
}
</script>

<template>
  <div class="profile-security-card">
    <AccountActionRow>
      <template #title>{{ t('users.password.reset') }}</template>
      <template #description>{{ t('users.password.old') }} / {{ t('users.password.new') }}</template>
      <template #actions>
        <el-button type="primary" @click="openSelfChangePasswordDialog">
          {{ t('users.password.reset') }}
        </el-button>
      </template>
    </AccountActionRow>

    <el-divider />
    <AccountActionRow>
      <template #title>{{ t('account.preferences.title') }}</template>
      <template #description>{{ t('account.preferences.subtitle') }}</template>
      <template #actions>
        <el-button :loading="resetting" type="warning" @click="handleResetPreferences">
          {{ t('account.preferences.reset') }}
        </el-button>
      </template>
    </AccountActionRow>
  </div>
</template>

<style lang="scss" scoped>
.profile-security-card {
  display: flex;
  flex-direction: column;
}
</style>
