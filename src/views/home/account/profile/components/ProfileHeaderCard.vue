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
    <div class="flex flex-wrap items-center gap-4">
      <el-avatar :size="72" :src="profile.avatar" />

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="m-0 text-lg font-medium">{{ profile.nickname }}</h3>
          <el-text type="info">@{{ profile.username }}</el-text>
        </div>

        <div class="mt-2 flex flex-col gap-2 text-sm">
          <!-- 所属部门 -->
          <div v-if="profile.deptList?.length" class="flex flex-wrap items-center gap-2">
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
          <div v-if="profile.postList?.length" class="flex flex-wrap items-center gap-2">
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
