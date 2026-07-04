<script lang="ts" setup>
import { getUserProfile, type SysUserProfileResponse } from '@/api/system/user-base';
import type { MeProfileUpdateRequest } from '@/api/system/user-me';
import { readStoredUserProfileEntry, writeUserProfileToStorage } from '@/core/session/userProfileStorage';
import { errorMessage } from '@/services/feedback/message';
import { useUserStoreHook } from '@/store/modules/user';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileBasicInfoCard from './components/ProfileBasicInfoCard.vue';
import ProfileHeaderCard from './components/ProfileHeaderCard.vue';

defineOptions({
  name: 'AccountProfile',
});

const { t } = useI18n();
const userStore = useUserStoreHook();

const loading = ref(false);
const profile = ref<SysUserProfileResponse | null>(null);

/**
 * 拉取个人档案
 */
async function loadProfileData() {
  loading.value = true;
  try {
    profile.value = await getUserProfile(userStore.userId);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'account.message.loadFailed' });
    profile.value = null;
  } finally {
    loading.value = false;
  }
}

/**
 * 资料保存成功后合并本地档案、同步 Store 与缓存
 */
function handleProfileSaved(updated: MeProfileUpdateRequest) {
  if (!profile.value) {
    return;
  }

  profile.value = { ...profile.value, ...updated };

  if (updated.nickname !== undefined) {
    userStore.SET_NICKNAME(updated.nickname);
  }
  if (updated.avatar !== undefined) {
    userStore.SET_AVATAR(updated.avatar);
  }

  const stored = readStoredUserProfileEntry();
  if (stored) {
    writeUserProfileToStorage(
      {
        avatar: userStore.avatar,
        username: stored.username ?? userStore.username,
        nickname: userStore.nickname,
        roles: stored.roles ?? userStore.roles,
        permissions: stored.permissions ?? userStore.permissions,
        userId: stored.userId ?? userStore.userId,
      },
      stored.expires ?? 0
    );
  }
}

onMounted(() => {
  loadProfileData();
});
</script>

<template>
  <div v-loading="loading" class="account-profile">
    <section class="account-profile__section">
      <el-divider content-position="left">{{ t('account.profile') }}</el-divider>
      <ProfileHeaderCard v-if="profile" :profile="profile" />
      <el-empty v-else-if="!loading" :description="t('account.message.loadFailed')" />
    </section>

    <section class="account-profile__section">
      <el-divider content-position="left">{{ t('account.field.basicInfo') }}</el-divider>
      <ProfileBasicInfoCard v-if="profile" :profile="profile" @saved="handleProfileSaved" />
      <el-empty v-else-if="!loading" :description="t('account.message.loadFailed')" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.account-profile {
  &__section {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>
