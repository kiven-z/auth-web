<script lang="ts">
/** 更新用户头像面板属性 */
export interface AvatarUpdatePanelProps {
  /** 目标用户主键 */
  userId: string;
  /** 目标用户名 */
  username: string;
  /** 当前头像 URL */
  avatar?: string | null;
}
</script>

<script lang="ts" setup>
import { updateUserAvatar } from '@/api/system/user/user';
import AvatarEditor from '@/components/domain/user/AvatarEditor';
import { message } from '@/services/feedback/message';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AvatarUpdatePanel',
});

const props = defineProps<AvatarUpdatePanelProps>();

const emit = defineEmits<{
  success: [avatarUrl: string];
}>();

const { t } = useI18n();
const displayAvatar = ref(props.avatar ?? null);

watch(
  () => props.avatar,
  (avatar) => {
    displayAvatar.value = avatar ?? null;
  }
);

/**
 * 头像上传成功后保存至目标用户
 * @param avatarUrl 新头像 URL
 */
async function handleAvatarUploaded(avatarUrl: string): Promise<void> {
  await updateUserAvatar({ userId: props.userId, avatar: avatarUrl });
  displayAvatar.value = avatarUrl;
  message(t('tips.editSuccess'), { type: 'success' });
  emit('success', avatarUrl);
}
</script>

<template>
  <div class="avatar-update-panel">
    <el-alert
      :closable="false"
      :title="t('account.avatar.uploadHint')"
      class="avatar-update-panel__hint"
      show-icon
      type="info"
    />

    <div class="avatar-update-panel__editor">
      <AvatarEditor :avatar="displayAvatar" :size="96" @uploaded="handleAvatarUploaded" />
      <div class="avatar-update-panel__meta">
        <p class="avatar-update-panel__username">{{ username }}</p>
        <p class="avatar-update-panel__tip">{{ t('users.avatar.updateHint') }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-update-panel {
  &__hint {
    margin-bottom: 16px;
  }

  &__editor {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }

  &__meta {
    flex: 1;
    min-width: 0;
  }

  &__username {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  &__tip {
    margin: 8px 0 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}
</style>
