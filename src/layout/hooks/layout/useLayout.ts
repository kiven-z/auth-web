import { getConfig } from '@/auth/config';
import { getUiPreferenceState } from '@/core/preferences/storage';
import { getRuntimeLayoutOverrideRef } from '@/core/preferences/runtime-layout';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { routerArrays } from '../../types';

/**
 * 布局模式与本地偏好初始化
 * @returns layout / layoutTheme / initStorage
 */
export function useLayout() {
  const preferenceState = getUiPreferenceState();
  const runtimeLayoutOverride = getRuntimeLayoutOverrideRef();
  const platformConfig = getConfig();

  const initStorage = () => {
    /** 路由标签默认项 */
    if (useMultiTagsStore().multiTagsCache && (!preferenceState.tags || preferenceState.tags.length === 0)) {
      preferenceState.tags = routerArrays;
    }
    /** 国际化 */
    if (!preferenceState.locale) {
      preferenceState.locale = { locale: platformConfig?.Locale ?? 'zh' };
      useI18n().locale.value = platformConfig?.Locale ?? 'zh';
    }
    /** 导航 */
    if (!preferenceState.layout) {
      preferenceState.layout = {
        layout: platformConfig?.Layout ?? 'vertical',
        theme: platformConfig?.Theme ?? 'light',
        darkMode: platformConfig?.DarkMode ?? false,
        sidebarStatus: platformConfig?.SidebarStatus ?? true,
        epThemeColor: platformConfig?.EpThemeColor ?? '#409EFF',
        themeColor: platformConfig?.Theme ?? 'light',
        overallStyle: platformConfig?.OverallStyle ?? 'light',
      };
    }
    /** 灰色模式、色弱模式、隐藏标签页 */
    if (!preferenceState.configure) {
      preferenceState.configure = {
        grey: platformConfig?.Grey ?? false,
        weak: platformConfig?.Weak ?? false,
        hideTabs: platformConfig?.HideTabs ?? false,
        hideFooter: platformConfig.HideFooter ?? true,
        showLogo: platformConfig?.ShowLogo ?? true,
        showModel: platformConfig?.ShowModel ?? 'smart',
        multiTagsCache: platformConfig?.MultiTagsCache ?? false,
        stretch: platformConfig?.Stretch ?? false,
      };
    }
  };

  /** 断点覆盖优先，否则为用户偏好中的布局模式 */
  const layout = computed(() => {
    return runtimeLayoutOverride.value ?? preferenceState?.layout.layout;
  });

  const layoutTheme = computed(() => {
    return preferenceState.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage,
  };
}
