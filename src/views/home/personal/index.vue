<script lang="ts" setup>
import { UserAvatar } from '@/components/domain/user/UserProfile';
import { useRenderIcon } from '@/components/ui/Icon';
import { getMenuTooltipEffect } from '@/layout/utils/platform';
import { useUserStore } from '@/store/modules/auth/user';
import usePersonalNav from '@/views/home/personal/hooks/shell/usePersonalNav';
import usePersonalSectionTransition, {
  resolvePersonalSection,
} from '@/views/home/personal/hooks/shell/usePersonalSectionTransition';
import { ArrowLeft, DArrowLeft, DArrowRight } from '@element-plus/icons-vue';
import 'animate.css';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'PersonalWorkspace',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const tooltipEffect = getMenuTooltipEffect();
const { navGroups } = usePersonalNav();
const { enterActiveClass, leaveActiveClass } = usePersonalSectionTransition(navGroups);

const sidebarCollapsed = ref(false);

/** 当前侧栏分区，与菜单 index 一致 */
const activeSection = computed(() => resolvePersonalSection(route.path));

const displayName = computed(() => userStore.nickname || userStore.username || t('personal.unknownUser'));

const subtitle = computed(() => {
  if (!userStore.username) {
    return '';
  }
  if (userStore.nickname && userStore.nickname !== userStore.username) {
    return userStore.username;
  }
  return userStore.primaryDeptName ?? '';
});

/**
 * 返回打开个人空间前的来源页；无记录时回首页
 */
function handleBack() {
  const from = history.state?.Personal;
  if (typeof from === 'string' && from.startsWith('/')) {
    void router.push(from);
    return;
  }
  void router.push('/');
}

/**
 * 侧栏选中：按分区键跳转子路由
 * @param index 分区键
 */
function handleSelect(index: string) {
  void router.push(`/personal/${index}`);
}
</script>

<template>
  <div class="personal-workspace">
    <aside :class="['personal-workspace__sidebar', { 'personal-workspace__sidebar--collapsed': sidebarCollapsed }]">
      <div class="personal-workspace__profile">
        <UserAvatar
          :avatar="userStore.avatar"
          :name="displayName"
          :size="sidebarCollapsed ? 32 : 44"
          class="personal-workspace__avatar"
        />
        <div v-show="!sidebarCollapsed" class="personal-workspace__identity">
          <div :title="displayName" class="personal-workspace__name">{{ displayName }}</div>
          <div v-if="subtitle" :title="subtitle" class="personal-workspace__subtitle">{{ subtitle }}</div>
        </div>
      </div>

      <el-scrollbar class="personal-workspace__scroll">
        <el-menu
          :key="activeSection"
          :collapse="sidebarCollapsed"
          :collapse-transition="false"
          :default-active="activeSection"
          :popper-effect="tooltipEffect"
          class="personal-workspace__menu"
          @select="handleSelect"
        >
          <el-menu-item-group v-for="group in navGroups" :key="group.key" :title="sidebarCollapsed ? '' : group.title">
            <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
              <div class="personal-workspace__menu-icon">
                <component :is="useRenderIcon(item.icon)" />
              </div>
              <template #title>
                <span class="personal-workspace__menu-title">{{ item.label }}</span>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-scrollbar>

      <div class="personal-workspace__footer">
        <button class="personal-workspace__footer-btn" type="button" @click="handleBack">
          <el-icon class="personal-workspace__footer-icon"><ArrowLeft /></el-icon>
          <span v-show="!sidebarCollapsed" class="personal-workspace__footer-label">
            {{ t('personal.back') }}
          </span>
        </button>
        <button class="personal-workspace__footer-btn" type="button" @click="sidebarCollapsed = !sidebarCollapsed">
          <el-icon class="personal-workspace__footer-icon">
            <DArrowRight v-if="sidebarCollapsed" />
            <DArrowLeft v-else />
          </el-icon>
          <span v-show="!sidebarCollapsed" class="personal-workspace__footer-label">
            {{ t('buttons.clickCollapse') }}
          </span>
        </button>
      </div>
    </aside>

    <main class="personal-workspace__main">
      <router-view v-slot="{ Component, route: childRoute }">
        <Transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" mode="out-in">
          <div :key="childRoute.fullPath" class="personal-workspace__panel">
            <component :is="Component" />
          </div>
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use './styles/personal';
</style>
