import { getRuntimeLayoutOverrideRef } from '@/core/preferences/runtime-layout';
import { useMultiTagsStore } from '@/store/modules/multiTags';
import { useGlobal } from '@pureadmin/utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { routerArrays } from '../../types';

export function useLayout() {
  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const runtimeLayoutOverride = getRuntimeLayoutOverrideRef();

  const initStorage = () => {
    /** 路由 */
    if (useMultiTagsStore().multiTagsCache && (!$storage.tags || $storage.tags.length === 0)) {
      $storage.tags = routerArrays;
    }
    /** 国际化 */
    if (!$storage.locale) {
      $storage.locale = { locale: $config?.Locale ?? 'zh' };
      useI18n().locale.value = $config?.Locale ?? 'zh';
    }
    /** 导航 */
    if (!$storage.layout) {
      $storage.layout = {
        layout: $config?.Layout ?? 'vertical',
        theme: $config?.Theme ?? 'light',
        darkMode: $config?.DarkMode ?? false,
        sidebarStatus: $config?.SidebarStatus ?? true,
        epThemeColor: $config?.EpThemeColor ?? '#409EFF',
        themeColor: $config?.Theme ?? 'light',
        overallStyle: $config?.OverallStyle ?? 'light',
      };
    }
    /** 灰色模式、色弱模式、隐藏标签页 */
    if (!$storage.configure) {
      $storage.configure = {
        grey: $config?.Grey ?? false,
        weak: $config?.Weak ?? false,
        hideTabs: $config?.HideTabs ?? false,
        hideFooter: $config.HideFooter ?? true,
        showLogo: $config?.ShowLogo ?? true,
        showModel: $config?.ShowModel ?? 'smart',
        multiTagsCache: $config?.MultiTagsCache ?? false,
        stretch: $config?.Stretch ?? false,
      };
    }
  };

  /** 断点覆盖优先，否则为用户偏好中的布局模式 */
  const layout = computed(() => {
    return runtimeLayoutOverride.value ?? $storage?.layout.layout;
  });

  const layoutTheme = computed(() => {
    return $storage.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage,
  };
}
