<script lang="ts" setup>
import type { LocaleType } from '@/auth/config/locales';
import { useSessionUserDisplay } from '@/layout/composables/useSessionUserDisplay';
import { useTranslationLang } from '@/layout/hooks/locale/useTranslationLang';
import { useLayoutUiStore } from '@/store/modules/app/layout-ui';
import { useHomePageNavigation } from '@/shared/composables/layout/useHomePageNavigation';
import { ref, watch } from 'vue';
import { useFullscreen } from '@vueuse/core';
import LayNotice from '../components/lay-notice/index.vue';
import LaySearch from '../components/lay-search/index.vue';

import GlobalizationIcon from '@/assets/svg/globalization.svg?component';
import Check from '~icons/ep/check';
import LogoutCircleRLine from '~icons/ri/logout-circle-r-line';
import Setting from '~icons/ri/settings-3-line';
import UserSettingsLine from '~icons/ri/user-settings-line';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

interface Props {
  /** 横向 el-menu 实例（模板传 ref 会自动解包） */
  menuInstance?: { handleResize?: () => void };
}

const props = defineProps<Props>();

const { openWithReturn } = useHomePageNavigation();
const layoutUiStore = useLayoutUiStore();
const { userAvatar, username, avatarsStyle, logout } = useSessionUserDisplay();
const {
  t,
  locale,
  translation: applyLocale,
  localeOptions,
  getDropdownItemStyle,
  getDropdownItemClass,
} = useTranslationLang();

/**
 * 切换语言并刷新横向菜单尺寸
 * @param localeValue 目标语言
 */
function translation(localeValue: LocaleType): void {
  applyLocale(localeValue);
  props.menuInstance?.handleResize?.();
}

const screenIcon = ref();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

isFullscreen.value = !!(
  document.fullscreenElement ||
  (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
  (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement ||
  (document as Document & { msFullscreenElement?: Element }).msFullscreenElement
);

watch(
  isFullscreen,
  (full) => {
    screenIcon.value = full ? ExitFullscreen : Fullscreen;
  },
  { immediate: true }
);
</script>

<template>
  <LaySearch id="header-search" />
  <el-dropdown id="header-translation" trigger="click">
    <GlobalizationIcon class="navbar-bg-hover w-10 h-12 p-2.75 cursor-pointer outline-hidden" />
    <template #dropdown>
      <el-dropdown-menu class="layout-toolbar__locale-menu">
        <el-dropdown-item
          v-for="item in localeOptions"
          :key="item.locale"
          :class="['dark:text-white!', getDropdownItemClass(locale, item.locale)]"
          :style="getDropdownItemStyle(locale, item.locale)"
          @click="translation(item.locale)"
        >
          <IconifyIconOffline v-show="locale === item.locale" :icon="Check" class="layout-toolbar__check" />
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span id="full-screen" class="layout-toolbar__fullscreen navbar-bg-hover" @click="toggleFullscreen">
    <IconifyIconOffline :icon="screenIcon" />
  </span>
  <LayNotice id="header-notice" />
  <el-dropdown trigger="click">
    <span class="el-dropdown-link navbar-bg-hover select-none">
      <img :src="userAvatar" :style="avatarsStyle" alt="avatar" />
      <p v-if="username" class="dark:text-white">{{ username }}</p>
    </span>
    <template #dropdown>
      <el-dropdown-menu class="layout-toolbar__logout-menu">
        <el-dropdown-item @click="openWithReturn('AccountProfile')">
          <IconifyIconOffline :icon="UserSettingsLine" style="margin: 5px" />
          {{ t('account.title') }}
        </el-dropdown-item>
        <el-dropdown-item @click="logout">
          <IconifyIconOffline :icon="LogoutCircleRLine" style="margin: 5px" />
          {{ t('buttons.loginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span
    :title="t('buttons.openSystemSet')"
    class="layout-toolbar__settings navbar-bg-hover"
    @click="layoutUiStore.openSettingsPanel()"
  >
    <IconifyIconOffline :icon="Setting" />
  </span>
</template>

<style lang="scss" scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 48px;
  padding: 10px;
  color: #000000d9;
  cursor: pointer;

  p {
    font-size: 14px;
  }

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
}

.layout-toolbar__locale-menu {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .layout-toolbar__check {
    position: absolute;
    left: 20px;
  }
}

.layout-toolbar__logout-menu {
  width: 140px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
