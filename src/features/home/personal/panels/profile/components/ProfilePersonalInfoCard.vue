<script lang="ts" setup>
import type { SysUserProfileResponse } from '@/features/system/api/user/user-base';
import { updateMyAvatar } from '@/features/system/api/user/user-me';
import AvatarUpdateCard from '@/components/domain/user/AvatarUpdateCard';
import { computed } from 'vue';
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

const deptCount = computed(() => Number(props.profile.deptCount ?? 0));
const postCount = computed(() => Number(props.profile.postCount ?? 0));

/**
 * 持久化当前用户头像
 * @param avatarUrl 新头像 URL
 */
async function persistAvatar(avatarUrl: string): Promise<void> {
  await updateMyAvatar({ avatar: avatarUrl });
}
</script>

<template>
  <section class="profile-personal-info-card">
    <AvatarUpdateCard :avatar="profile.avatar" :persist="persistAvatar" @success="emit('avatarUpdated', $event)">
      <template #meta>
        <div class="profile-personal-info-card__summary-content">
          <div class="profile-personal-info-card__name-row">
            <h3 class="profile-personal-info-card__nickname">{{ profile.nickname }}</h3>
            <el-text type="info">@{{ profile.username }}</el-text>
          </div>

          <div class="profile-personal-info-card__meta">
            <div class="profile-personal-info-card__meta-row">
              <span class="profile-personal-info-card__metric">
                <span class="profile-personal-info-card__metric-label">{{ t('users.bound.depts.title') }}</span>
                <span class="profile-personal-info-card__metric-value">{{ deptCount }}</span>
              </span>
              <span class="profile-personal-info-card__metric">
                <span class="profile-personal-info-card__metric-label">{{ t('users.bound.posts.title') }}</span>
                <span class="profile-personal-info-card__metric-value">{{ postCount }}</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </AvatarUpdateCard>
  </section>
</template>

<style lang="scss" scoped>
.profile-personal-info-card {
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
    gap: 8px 20px;
    align-items: baseline;
  }

  &__metric {
    display: inline-flex;
    gap: 8px;
    align-items: baseline;
    cursor: default;
  }

  &__metric-label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__metric-value {
    font-size: 16px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--el-text-color-primary);
  }
}
</style>
