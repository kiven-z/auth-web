<script lang="ts" setup>
import type { SysUserProfileResponse } from '@/api/system/user-base';
import { updateMyAvatar } from '@/api/system/user-me';
import { message } from '@/services/feedback/message';
import { useAvatarCropFlow } from '@/views/home/account/profile/hooks/useAvatarCropFlow';
import { Camera, Loading } from '@element-plus/icons-vue';
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
const avatarHovering = ref(false);
const displayAvatar = ref(props.profile.avatar);

const { avatarUploadRef, avatarUploading, avatarCropping, handleAvatarChange } = useAvatarCropFlow({
  showSuccessMessage: false,
  onAvatarUploaded: async (avatarUrl: string) => {
    await updateMyAvatar({ avatar: avatarUrl });
    displayAvatar.value = avatarUrl;
    message(t('tips.editSuccess'), { type: 'success' });
    emit('avatarUpdated', avatarUrl);
  },
});

watch(
  () => props.profile.avatar,
  (avatar) => {
    displayAvatar.value = avatar;
  }
);
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
      <div
        class="profile-personal-info-card__avatar-editor"
        @mouseenter="avatarHovering = true"
        @mouseleave="avatarHovering = false"
      >
        <el-avatar :size="72" :src="displayAvatar || undefined" class="profile-personal-info-card__avatar-preview" />
        <div
          v-show="avatarHovering && !avatarUploading && !avatarCropping"
          class="profile-personal-info-card__avatar-mask"
        >
          <el-icon :size="24"><Camera /></el-icon>
        </div>
        <el-icon v-if="avatarUploading || avatarCropping" :size="24" class="profile-personal-info-card__avatar-loading">
          <Loading />
        </el-icon>
        <el-upload
          ref="avatarUploadRef"
          :auto-upload="false"
          :disabled="avatarUploading || avatarCropping"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/webp"
          class="profile-personal-info-card__avatar-upload"
          @change="handleAvatarChange"
        />
      </div>

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
    align-items: center;
    gap: 16px;
  }

  &__summary-content {
    min-width: 0;
    flex: 1;
  }

  &__name-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
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
    align-items: center;
    gap: 8px;
  }

  &__avatar-editor {
    position: relative;
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    cursor: pointer;
  }

  &__avatar-preview {
    width: 72px;
    height: 72px;
  }

  &__avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgb(0 0 0 / 45%);
    color: #fff;
    pointer-events: none;
  }

  &__avatar-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgb(0 0 0 / 45%);
    color: #fff;
    animation: rotating 1.5s linear infinite;
    pointer-events: none;
  }

  &__avatar-upload {
    position: absolute;
    inset: 0;
    opacity: 0;

    :deep(.el-upload) {
      width: 100%;
      height: 100%;
    }
  }

  &__avatar-hint {
    margin-bottom: 16px;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (hover: none) {
  .profile-personal-info-card__avatar-mask {
    opacity: 0.85;
  }
}
</style>
