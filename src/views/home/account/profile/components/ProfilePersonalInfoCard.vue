<script lang="ts" setup>
import type { SysUserProfileResponse } from '@/api/system/user/user-base';
import { updateMyAvatar } from '@/api/system/user/user-me';
import AvatarEditor from '@/components/business/AvatarEditor';
import { message } from '@/services/feedback/message';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfilePersonalInfoCard',
});

const props = defineProps<{
  profile: SysUserProfileResponse;
}>();

const emit = defineEmits<{
  avatarUpdated: [avatarUrl: string];
}>();

const { t } = useI18n();
const displayAvatar = ref(props.profile.avatar);

watch(
  () => props.profile.avatar,
  (avatar) => {
    displayAvatar.value = avatar;
  }
);

/**
 * 头像上传成功后保存至当前用户
 * @param avatarUrl 新头像 URL
 */
async function handleAvatarUploaded(avatarUrl: string): Promise<void> {
  await updateMyAvatar({ avatar: avatarUrl });
  displayAvatar.value = avatarUrl;
  message(t('tips.editSuccess'), { type: 'success' });
  emit('avatarUpdated', avatarUrl);
}
</script>

<template>
  <section class="profile-personal-info-card">
    <el-alert
      :closable="false"
      :title="t('account.avatar.uploadHint')"
      class="profile-personal-info-card__avatar-hint"
      show-icon
      type="info"
    />

    <div class="profile-personal-info-card__summary">
      <AvatarEditor :avatar="displayAvatar" @uploaded="handleAvatarUploaded" />

      <div class="profile-personal-info-card__summary-content">
        <div class="profile-personal-info-card__name-row">
          <h3 class="profile-personal-info-card__nickname">{{ profile.nickname }}</h3>
          <el-text type="info">@{{ profile.username }}</el-text>
        </div>

        <div class="profile-personal-info-card__meta">
          <!-- 所属部门 -->
          <div v-if="profile.deptList?.length" class="profile-personal-info-card__meta-row">
            <span>{{ t('assign.dept') }}：</span>
            <el-tag
              v-for="dept in profile.deptList"
              :key="dept.id"
              :type="dept.isPrimary ? 'primary' : 'info'"
              effect="plain"
            >
              {{ dept.deptName }}
            </el-tag>
          </div>

          <!-- 任职岗位 -->
          <div v-if="profile.postList?.length" class="profile-personal-info-card__meta-row">
            <span>{{ t('assign.post') }}：</span>
            <el-tag
              v-for="post in profile.postList"
              :key="post.id"
              :type="post.isPrimary ? 'primary' : 'info'"
              effect="plain"
            >
              {{ post.postName }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.profile-personal-info-card {
  &__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  &__summary-content {
    flex: 1;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__nickname {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    font-size: 14px;
  }

  &__meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__avatar-hint {
    margin-bottom: 16px;
  }
}
</style>
