import { getResponsiveStorage } from '@/bootstrap/responsive';
import { UI_PREFERENCE_KEYS } from './keys';
import { getIsHydrating, schedulePreferenceSync } from './sync';

/**
 * 获取 responsive-storage 全局实例
 * @returns $storage
 */
function getStorage(): ResponsiveStorage {
  return getResponsiveStorage();
}

/**
 * 读取当前 locale 快照
 * @returns locale 配置
 */
export function getLocaleSnapshot(): ResponsiveStorage['locale'] {
  return { ...getStorage().locale };
}

/**
 * 读取当前 layout 快照
 * @returns layout 配置
 */
export function getLayoutSnapshot(): ResponsiveStorage['layout'] {
  return { ...getStorage().layout };
}

/**
 * 读取当前 configure 快照
 * @returns configure 配置
 */
export function getConfigureSnapshot(): ResponsiveStorage['configure'] {
  return { ...getStorage().configure };
}

/**
 * 合并写入 locale 并调度同步
 * @param patch 待合并字段
 */
export function patchLocale(patch: Partial<ResponsiveStorage['locale']>): void {
  const $storage = getStorage();
  $storage.locale = { ...$storage.locale, ...patch };
  if (!getIsHydrating()) {
    schedulePreferenceSync(UI_PREFERENCE_KEYS.LOCALE);
  }
}

/**
 * 合并写入 layout 并调度同步
 * @param patch 待合并字段
 */
export function patchLayout(patch: Partial<ResponsiveStorage['layout']>): void {
  const $storage = getStorage();
  $storage.layout = { ...$storage.layout, ...patch };
  if (!getIsHydrating()) {
    schedulePreferenceSync(UI_PREFERENCE_KEYS.LAYOUT);
  }
}

/**
 * 合并写入 configure 并调度同步
 * @param patch 待合并字段
 */
export function patchConfigure(patch: Partial<ResponsiveStorage['configure']>): void {
  const $storage = getStorage();
  $storage.configure = { ...$storage.configure, ...patch };
  if (!getIsHydrating()) {
    schedulePreferenceSync(UI_PREFERENCE_KEYS.CONFIGURE);
  }
}

/**
 * 重置本地 UI 偏好为平台默认（不触发服务端同步）
 * @param defaults 默认 locale / layout / configure
 */
export function resetLocalUiPreferences(defaults: {
  locale: ResponsiveStorage['locale'];
  layout: ResponsiveStorage['layout'];
  configure: ResponsiveStorage['configure'];
}): void {
  const $storage = getStorage();
  $storage.locale = { ...defaults.locale };
  $storage.layout = { ...defaults.layout };
  $storage.configure = { ...defaults.configure };
}
