<script lang="ts" setup>
import type { SysUserProfileResponse } from '@/api/system/user-base';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileHeaderCard',
});

defineProps<{
  profile: SysUserProfileResponse;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="profile-header-card">
    <div class="profile-header-card__body">
      <el-avatar :size="72" :src="profile.avatar" class="profile-header-card__avatar" />

      <div class="profile-header-card__content">
        <div class="profile-header-card__name-row">
          <h3 class="profile-header-card__nickname">{{ profile.nickname }}</h3>
          <el-text type="info">@{{ profile.username }}</el-text>
        </div>

        <div class="profile-header-card__meta">
          <!-- 所属部门 -->
          <div v-if="profile.deptList?.length" class="profile-header-card__meta-row">
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
          <div v-if="profile.postList?.length" class="profile-header-card__meta-row">
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
  </div>
</template>

<style lang="scss" scoped>
.profile-header-card {
  &__body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  &__content {
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
}
</style>
