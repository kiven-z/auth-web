<script lang="ts" setup>
import { getUserProfile, type SysUserProfileResponse } from '@/api/system/user-base';
import { listMySessions, type MeUserSession } from '@/api/system/user-me';
import { errorMessage } from '@/services/feedback/message';
import { useUserStoreHook } from '@/store/modules/user';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileBasicInfoCard from './components/ProfileBasicInfoCard.vue';
import ProfileHeaderCard from './components/ProfileHeaderCard.vue';
import ProfileSecurityCard from './components/ProfileSecurityCard.vue';
import ProfileSessionsPanel from './components/ProfileSessionsPanel.vue';

defineOptions({
  name: 'AccountProfile',
});

const { t } = useI18n();
const userStore = useUserStoreHook();

const loading = ref(false);
const profile = ref<SysUserProfileResponse | null>(null);
const sessions = ref<MeUserSession[]>([]);
const activeNames = ref(['header', 'basic', 'security', 'sessions']);

/**
 * 拉取个人档案与活跃会话
 */
async function loadProfileData() {
  loading.value = true;
  try {
    const [profileData, sessionData] = await Promise.all([getUserProfile(userStore.userId), listMySessions()]);
    profile.value = profileData;
    sessions.value = sessionData;
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'account.message.loadFailed' });
    profile.value = null;
    sessions.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadProfileData();
});
</script>

<template>
  <div v-loading="loading" class="account-profile">
    <el-collapse v-model="activeNames" class="account-profile-collapse">
      <el-collapse-item :title="t('account.profile')" name="header">
        <ProfileHeaderCard v-if="profile" :profile="profile" />
        <el-empty v-else-if="!loading" :description="t('account.message.loadFailed')" />
      </el-collapse-item>

      <el-collapse-item :title="t('account.field.basicInfo')" name="basic">
        <ProfileBasicInfoCard v-if="profile" :profile="profile" />
        <el-empty v-else-if="!loading" :description="t('account.message.loadFailed')" />
      </el-collapse-item>

      <el-collapse-item :title="t('account.field.security')" name="security">
        <ProfileSecurityCard />
      </el-collapse-item>

      <el-collapse-item :title="t('account.session.title')" name="sessions">
        <ProfileSessionsPanel v-model:sessions="sessions" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
