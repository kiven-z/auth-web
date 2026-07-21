import { getConfig } from '@/auth/config';
import { applyThemePreferences, getLayoutSnapshot, patchLayout } from '@/core/preferences';
import { NAV_THEME_COLOR_ITEMS } from '@/core/preferences/nav-theme-colors';
import { reconcileNavTheme } from '@/core/preferences/reconcile-nav-theme';
import { useLayout } from '@/layout/hooks';
import { useEpThemeStoreHook } from '@/store/modules/app/epTheme';
import { useGlobal } from '@pureadmin/utils';
import { ref } from 'vue';
import type { themeColorsType } from '../../types';

const OVERALL_STYLES = new Set(['light', 'dark', 'system']);

/**
 * UI 主题与 layout 色相关写入（经 preferences storage 网关）
 * @returns 主题读写与 DOM 副作用
 */
export function useUiTheme() {
  const { layoutTheme } = useLayout();
  const { $storage } = useGlobal<GlobalPropertiesApi>();
  const epThemeStore = useEpThemeStoreHook();

  const themeColors = ref<Array<themeColorsType>>([...NAV_THEME_COLOR_ITEMS]);

  const dataTheme = ref<boolean>($storage?.layout?.darkMode ?? false);
  const overallStyle = ref<string>($storage?.layout?.overallStyle ?? 'light');

  /**
   * 设置 Element Plus 主色并持久化
   * @param color 色值
   * @param options skipApply 为 true 时仅写入 storage，由调用方统一 apply
   */
  function setEpThemeColor(color: string, options?: { skipApply?: boolean }): void {
    patchLayout({
      epThemeColor: color,
      theme: getLayoutSnapshot().theme ?? getConfig().Theme,
    });
    if (!options?.skipApply) {
      applyThemePreferences();
    }
  }

  /**
   * 设置导航主题色
   * @param theme 主题标识
   * @param isClick 是否用户点击（保留原 themeColor 逻辑）
   * @param options skipApply 为 true 时仅写入 storage，由调用方统一 apply
   */
  function setLayoutThemeColor(
    theme = getConfig().Theme ?? 'light',
    isClick = true,
    options?: { skipApply?: boolean }
  ): void {
    const snapshot = getLayoutSnapshot();
    const patch: Partial<ResponsiveStorage['layout']> = {
      theme,
      themeColor: isClick ? theme : snapshot.themeColor,
    };

    if (theme === 'default' || theme === 'light') {
      patch.epThemeColor = getConfig().EpThemeColor;
    } else {
      const colors = themeColors.value.find((item) => item.themeColor === theme);
      if (colors) {
        patch.epThemeColor = colors.color;
      }
    }

    patchLayout(patch);
    if (!options?.skipApply) {
      applyThemePreferences();
    }
  }

  /**
   * 浅色 / 深色 / 跟随系统整体风格切换
   * @param overall 整体风格；登录页开关可能传入非标准值，此时按 dataTheme 同步为 light/dark
   */
  function dataThemeChange(overall?: string): void {
    if (overall && OVERALL_STYLES.has(overall)) {
      overallStyle.value = overall;
    } else {
      overallStyle.value = dataTheme.value ? 'dark' : 'light';
    }

    if (overallStyle.value === 'system') {
      dataTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const snapshot = getLayoutSnapshot();
    const baseTheme = epThemeStore.epTheme ?? snapshot.theme ?? getConfig().Theme ?? 'light';
    const nextTheme = reconcileNavTheme({ theme: baseTheme, themeColor: snapshot.themeColor }, dataTheme.value);
    setLayoutThemeColor(nextTheme, false, { skipApply: true });

    patchLayout({ darkMode: dataTheme.value, overallStyle: overallStyle.value });
    applyThemePreferences();
  }

  return {
    dataTheme,
    overallStyle,
    layoutTheme,
    themeColors,
    setEpThemeColor,
    setLayoutThemeColor,
    dataThemeChange,
  };
}
