import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/locale-preferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';
import { applyEffectiveLayoutToShell } from './layout-override';
import { applyLocaleToI18n } from './locale-effect';

/** 将布局偏好应用到 body 与布局壳运行时 */
export function applyLayoutPreferences(): void {
  const layoutStore = useLayoutPreferencesStore();
  applyEffectiveLayoutToShell(layoutStore.layout);
  useLayoutShellRuntimeStore().sidebar.opened = layoutStore.sidebarStatus;
}

/** 将当前界面偏好应用到 DOM、i18n 与布局壳 */
export function applyHydratedUiPreferences(): void {
  applyLocaleToI18n(useLocalePreferencesStore().locale);
  useThemePreferencesStore().$applyToDom();
  useDisplayPreferencesStore().$applyToDom();
  applyLayoutPreferences();
}
