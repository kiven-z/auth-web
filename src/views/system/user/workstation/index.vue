<script lang="ts" setup>
import { getUserProfile, type SysUserProfileResponse } from '@/api/system/user/user-base';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import '@/components/ui/Icon/src/offline';
import { getMenuTooltipEffect } from '@/layout/utils/tooltip-effect';
import { errorMessage } from '@/services/feedback/message';
import { WORKSTATION_PROFILE_KEY } from '@/views/system/user/workstation/constants/workstation-profile';
import useWorkstationNav from '@/views/system/user/workstation/hooks/useWorkstationNav';
import useWorkstationSectionTransition from '@/views/system/user/workstation/hooks/useWorkstationSectionTransition';
import { ArrowLeft } from '@element-plus/icons-vue';
import { computed, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import ArrowLeftDouble from '~icons/ri/arrow-left-double-fill';
import ArrowRightDouble from '~icons/ri/arrow-right-double-fill';

defineOptions({
  name: 'UserWorkstation',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const tooltipEffect = getMenuTooltipEffect();
const { navGroups } = useWorkstationNav();
const { enterActiveClass, leaveActiveClass } = useWorkstationSectionTransition(navGroups);

const loading = ref(true);
const profile = ref<SysUserProfileResponse | null>(null);
const loadFailed = ref(false);
const sidebarCollapsed = ref(false);

const userId = computed(() => String(route.params.userId ?? ''));

/** 当前子路径段，与菜单 index / 路由 path 一致 */
const activeSection = computed(() => route.path.split('/').pop() || 'overview');

const displayName = computed(() => {
  if (loading.value) {
    return t('users.workstation.loadingName');
  }
  const row = profile.value;
  if (!row) {
    return t('users.workstation.unknownUser');
  }
  return row.nickname || row.username;
});

const subtitle = computed(() => {
  if (loading.value || !profile.value) {
    return '';
  }
  return profile.value.username;
});

/**
 * 拉取工作台顶部展示用的用户档案
 */
async function loadProfile() {
  if (!userId.value) {
    loading.value = false;
    loadFailed.value = true;
    profile.value = null;
    return;
  }

  loading.value = true;
  loadFailed.value = false;
  try {
    profile.value = await getUserProfile(userId.value);
  } catch (error: unknown) {
    errorMessage(error);
    profile.value = null;
    loadFailed.value = true;
  } finally {
    loading.value = false;
  }
}

/**
 * 返回用户列表：优先来源页，否则 SystemUser，再否则首页
 */
function handleBack() {
  const from = history.state?.UserWorkstation;
  if (typeof from === 'string' && from.startsWith('/')) {
    void router.push(from);
    return;
  }
  if (router.hasRoute('SystemUser')) {
    void router.push({ name: 'SystemUser' });
    return;
  }
  void router.push('/');
}

watch(userId, () => void loadProfile(), { immediate: true });

/**
 * 合并更新本地档案（侧栏与子面板同步）
 * @param patch 局部字段
 */
function patchProfile(patch: Partial<SysUserProfileResponse>) {
  if (!profile.value) {
    return;
  }
  profile.value = { ...profile.value, ...patch };
}

provide(WORKSTATION_PROFILE_KEY, { profile, loading, loadFailed, patchProfile });
</script>

<template>
  <div v-loading="loading" class="user-workstation">
    <aside :class="['user-workstation__sidebar', { 'user-workstation__sidebar--collapsed': sidebarCollapsed }]">
      <!-- 顶部身份 -->
      <div class="user-workstation__profile">
        <el-avatar
          :size="sidebarCollapsed ? 32 : 44"
          :src="profile?.avatar || undefined"
          class="user-workstation__avatar"
        >
          {{ displayName.slice(0, 1) }}
        </el-avatar>
        <div v-show="!sidebarCollapsed" class="user-workstation__identity">
          <div :title="displayName" class="user-workstation__name">{{ displayName }}</div>
          <div v-if="subtitle" :title="subtitle" class="user-workstation__subtitle">{{ subtitle }}</div>
          <div v-else-if="loadFailed" class="user-workstation__subtitle">
            {{ t('users.workstation.loadFailedHint') }}
          </div>
        </div>
      </div>

      <el-scrollbar class="user-workstation__scroll">
        <el-menu
          :key="activeSection"
          :collapse="sidebarCollapsed"
          :collapse-transition="false"
          :default-active="activeSection"
          :popper-effect="tooltipEffect"
          class="user-workstation__menu"
          @select="(index) => router.push(`/system/user-workstation/${userId}/${index}`)"
        >
          <el-menu-item-group v-for="group in navGroups" :key="group.key" :title="sidebarCollapsed ? '' : group.title">
            <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
              <div class="user-workstation__menu-icon">
                <component :is="useRenderIcon(item.icon)" />
              </div>
              <template #title>
                <span class="user-workstation__menu-title">{{ item.label }}</span>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-scrollbar>

      <!-- 底部：返回 + 折叠 -->
      <div class="user-workstation__footer">
        <button class="user-workstation__footer-btn" type="button" @click="handleBack">
          <el-icon class="user-workstation__footer-icon"><ArrowLeft /></el-icon>
          <span v-show="!sidebarCollapsed">{{ t('users.workstation.back') }}</span>
        </button>
        <button class="user-workstation__footer-btn" type="button" @click="sidebarCollapsed = !sidebarCollapsed">
          <IconifyIconOffline
            :icon="sidebarCollapsed ? ArrowRightDouble : ArrowLeftDouble"
            class="user-workstation__footer-icon"
          />
          <span v-show="!sidebarCollapsed">{{ t('buttons.clickCollapse') }}</span>
        </button>
      </div>
    </aside>

    <!-- 右侧面板：按侧栏上下方向切换滑动动画 -->
    <main class="user-workstation__main">
      <router-view v-slot="{ Component, route: childRoute }">
        <Transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" mode="out-in">
          <div :key="childRoute.fullPath" class="user-workstation__panel">
            <component :is="Component" />
          </div>
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use './styles/workstation';
</style>
