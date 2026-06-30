import { getConfig } from '@/auth/config';
import type { LocaleType } from '@/auth/config/locales';
import { i18n } from '@/plugins/i18n';
import { emitter } from '@/services/event-bus/mitt';
import { useAppStoreHook } from '@/store/modules/app';
import { useEpThemeStoreHook } from '@/store/modules/epTheme';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { darken, lighten } from '@pureadmin/utils';
import { getConfigureSnapshot, getLayoutSnapshot, getLocaleSnapshot } from './storage';

const NAV_THEME_COLORS: Record<string, string> = {
  light: '#ffffff',
  default: '#1b2a47',
  saucePurple: '#722ed1',
  pink: '#eb2f96',
  dusk: '#f5222d',
  volcano: '#fa541c',
  mingQing: '#13c2c2',
  auroraGreen: '#52c41a',
};

/**
 * 根据 overallStyle 与 OS 偏好解析是否深色
 * @param layout layout 快照
 * @returns 是否深色
 */
export function resolveEffectiveDarkMode(layout: ResponsiveStorage['layout']): boolean {
  const overall = layout.overallStyle ?? 'light';
  if (overall === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (overall === 'dark') {
    return true;
  }
  return Boolean(layout.darkMode);
}

function setPropertyPrimary(mode: string, index: number, color: string, darkMode: boolean): void {
  document.documentElement.style.setProperty(
    `--el-color-primary-${mode}-${index}`,
    darkMode ? darken(color, index / 10) : lighten(color, index / 10)
  );
}

function applyEpThemeColorToDom(color: string, darkMode: boolean, theme: string): void {
  const epThemeStore = useEpThemeStoreHook();
  epThemeStore.epThemeColor = color;
  epThemeStore.epTheme = theme;
  document.documentElement.style.setProperty('--el-color-primary', color);
  for (let index = 1; index <= 2; index++) {
    setPropertyPrimary('dark', index, color, darkMode);
  }
  for (let index = 1; index <= 9; index++) {
    setPropertyPrimary('light', index, color, darkMode);
  }
}

function resolveNavTheme(theme: string, darkMode: boolean): string {
  if (theme === 'light' && darkMode) {
    return 'default';
  }
  return theme;
}

function resolveEpThemeColor(navTheme: string, snapshot: ResponsiveStorage['layout']): string {
  if (navTheme === 'default' || navTheme === 'light') {
    return getConfig().EpThemeColor;
  }
  return NAV_THEME_COLORS[navTheme] ?? snapshot.epThemeColor ?? getConfig().EpThemeColor;
}

/**
 * 将 locale 偏好应用到 i18n（无需组件实例）
 */
export function applyLocalePreferences(): void {
  const localeValue = (getLocaleSnapshot().locale ?? 'zh') as LocaleType;
  if (typeof i18n.global.locale === 'string') {
    i18n.global.locale = localeValue;
  } else {
    i18n.global.locale.value = localeValue;
  }
}

/**
 * 将 layout 偏好应用到 DOM 与 app store（无需组件实例）
 */
export function applyLayoutPreferences(): void {
  const snapshot = getLayoutSnapshot();
  const layoutModel = snapshot.layout ?? getConfig().Layout ?? 'vertical';
  window.document.body.setAttribute('layout', layoutModel);
  useAppStoreHook().setLayout(layoutModel);
  if (snapshot.sidebarStatus !== undefined) {
    useAppStoreHook().sidebar.opened = snapshot.sidebarStatus;
  }
}

/**
 * 将主题偏好应用到 DOM 与 epTheme store（无需组件实例）
 */
export function applyThemePreferences(): void {
  const snapshot = getLayoutSnapshot();
  const darkMode = resolveEffectiveDarkMode(snapshot);
  const theme = snapshot.theme ?? getConfig().Theme ?? 'light';
  const navTheme = resolveNavTheme(theme, darkMode);

  document.documentElement.setAttribute('data-theme', navTheme);
  applyEpThemeColorToDom(resolveEpThemeColor(navTheme, snapshot), darkMode, navTheme);

  if (darkMode) {
    document.documentElement.classList.add('dark');
    return;
  }

  if (snapshot.themeColor === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    applyEpThemeColorToDom(getConfig().EpThemeColor, false, 'light');
  }
  document.documentElement.classList.remove('dark');
}

/**
 * 将 configure 字段子集应用到 DOM / store / 事件总线
 * @param patch 待应用字段（仅处理 patch 中出现的键）
 */
export function applyConfigureSideEffects(patch: Partial<ResponsiveStorage['configure']>): void {
  const html = document.querySelector('html');

  if ('grey' in patch && patch.grey !== undefined) {
    html?.classList.toggle('html-grey', Boolean(patch.grey));
  }
  if ('weak' in patch && patch.weak !== undefined) {
    html?.classList.toggle('html-weakness', Boolean(patch.weak));
  }
  if ('multiTagsCache' in patch && patch.multiTagsCache !== undefined) {
    useMultiTagsStoreHook().multiTagsCacheChange(patch.multiTagsCache);
  }
  if ('hideTabs' in patch && patch.hideTabs !== undefined) {
    emitter.emit('tagViewsChange', String(patch.hideTabs));
  }
  if ('showModel' in patch && patch.showModel !== undefined) {
    emitter.emit('tagViewsShowModel', patch.showModel);
  }
  if ('showLogo' in patch && patch.showLogo !== undefined) {
    emitter.emit('logoChange', patch.showLogo);
  }
}

/**
 * 将 configure 偏好应用到 DOM / store / 事件总线（无需组件实例）
 */
export function applyConfigurePreferences(): void {
  applyConfigureSideEffects(getConfigureSnapshot());
}

/**
 * hydrate 完成后将 storage 中的 UI 偏好应用到 DOM、i18n 与 store
 */
export function applyHydratedUiPreferences(): void {
  applyLocalePreferences();
  applyThemePreferences();
  applyLayoutPreferences();
  applyConfigurePreferences();
}
