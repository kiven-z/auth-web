<script lang="ts" setup>
// 独立全页不经 Layout，需自行加载离线图标表
import { getUserProfile, type SysUserProfileResponse } from '@/api/system/user/user-base';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import '@/components/ui/Icon/src/offline';
import { getMenuTooltipEffect } from '@/layout/utils/tooltip-effect';
import { errorMessage } from '@/services/feedback/message';
import useWorkstationNav, {
  USER_WORKSTATION_DEFAULT_SECTION,
  type UserWorkstationSection,
} from '@/views/system/user/workstation/hooks/useWorkstationNav';
import { ArrowLeft } from '@element-plus/icons-vue';
import type { MenuInstance } from 'element-plus';
import { computed, nextTick, ref, watch } from 'vue';
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

const menuRef = ref<MenuInstance>();
const loading = ref(true);
const profile = ref<SysUserProfileResponse | null>(null);
const loadFailed = ref(false);
const activeSection = ref<UserWorkstationSection>(USER_WORKSTATION_DEFAULT_SECTION);
const sidebarCollapsed = ref(false);

const userId = computed(() => String(route.params.userId ?? ''));

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
 * 当前激活项若不在可见菜单中，回落到第一项或默认概览
 */
function syncActiveSection() {
  const keys = navGroups.value.flatMap((group) => group.items.map((item) => item.key));
  if (keys.includes(activeSection.value)) {
    return;
  }
  activeSection.value = keys[0] ?? USER_WORKSTATION_DEFAULT_SECTION;
  void nextTick(() => {
    menuRef.value?.updateActiveIndex?.(activeSection.value);
  });
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

/**
 * 切换侧栏折叠
 */
function toggleCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

/**
 * 选中侧栏菜单项
 * @param index el-menu index
 */
function handleSelect(index: string) {
  activeSection.value = index as UserWorkstationSection;
}

watch(userId, () => void loadProfile(), { immediate: true });
watch(navGroups, syncActiveSection, { immediate: true });
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
          ref="menuRef"
          :collapse="sidebarCollapsed"
          :collapse-transition="false"
          :default-active="activeSection"
          :popper-effect="tooltipEffect"
          class="user-workstation__menu"
          @select="handleSelect"
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
        <button class="user-workstation__footer-btn" type="button" @click="toggleCollapse">
          <IconifyIconOffline
            :icon="sidebarCollapsed ? ArrowRightDouble : ArrowLeftDouble"
            class="user-workstation__footer-icon"
          />
          <span v-show="!sidebarCollapsed">{{ t('buttons.clickCollapse') }}</span>
        </button>
      </div>
    </aside>

    <!-- 右侧面板后续按分区接入 -->
    <main class="user-workstation__main">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.user-workstation {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--el-bg-color-page, var(--el-fill-color-blank));

  &__sidebar {
    display: flex;
    flex-direction: column;
    width: 210px;
    height: 100%;
    overflow: hidden;
    background: var(--auth-theme-menu-bg, var(--el-bg-color));
    border-right: 1px solid var(--auth-border-color);
    transition: width var(--auth-transition-duration);

    &--collapsed {
      width: 64px;
    }
  }

  &__profile {
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    align-items: center;
    padding: 16px 14px;
    border-bottom: 1px solid var(--auth-border-color);
  }

  &__sidebar--collapsed &__profile {
    justify-content: center;
    padding: 16px 0;
  }

  &__avatar {
    flex-shrink: 0;
    color: var(--el-color-white);
    background: var(--el-color-primary-light-5);
  }

  &__identity {
    flex: 1;
    min-width: 0;
  }

  &__name,
  &__subtitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__name {
    font-weight: 600;
    color: var(--auth-theme-menu-text, var(--el-text-color-regular));
  }

  &__subtitle {
    margin-top: 2px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__scroll {
    flex: 1;
    min-height: 0;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden !important;
    }
  }

  &__menu-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    font-size: 18px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  &__menu {
    --el-menu-bg-color: transparent;
    --el-menu-hover-bg-color: transparent;
    --el-menu-text-color: var(--auth-theme-menu-text, var(--el-text-color-primary));
    --el-menu-active-color: #fff;

    border-right: none;

    :deep(.el-menu-item-group__title) {
      padding: 12px 20px 6px;
      font-size: 12px;
      line-height: 1.4;
      color: var(--el-text-color-secondary);
    }

    :deep(.el-menu-item) {
      position: relative;
      height: 50px;
      background-color: transparent !important;

      &:hover {
        background-color: var(--auth-theme-menu-hover, var(--el-fill-color-light)) !important;
        border-radius: var(--auth-menu-item-radius, 8px);
      }

      &.is-active {
        color: #fff;

        &::before {
          position: absolute;
          inset: 0 8px;
          margin: 4px 0;
          content: '';
          background: var(--el-color-primary);
          border-radius: var(--auth-menu-item-radius, 8px);
        }

        .user-workstation__menu-icon,
        .user-workstation__menu-title {
          z-index: 1;
          color: #fff;
        }
      }
    }

    &.el-menu--collapse {
      width: 100% !important;

      :deep(.el-menu-item-group__title) {
        display: none;
      }

      :deep(.el-menu-tooltip__trigger) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .user-workstation__menu-icon {
        margin-right: 0;
      }
    }
  }

  &__footer {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    border-top: 1px solid var(--auth-border-color);
    box-shadow: 0 0 6px -3px var(--el-color-primary);
  }

  &__footer-btn {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
    color: var(--auth-theme-menu-text, var(--el-text-color-regular));
    cursor: pointer;
    background: transparent;
    border: none;

    &:hover {
      color: var(--auth-theme-menu-title-hover, var(--el-color-primary));
    }

    & + & {
      border-top: 1px solid var(--auth-border-color);
    }
  }

  &__footer-icon {
    font-size: 16px;
  }

  &__sidebar--collapsed &__footer-btn {
    justify-content: center;
    padding: 0;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
}
</style>
