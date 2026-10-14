import { UI_PREFERENCES_STORAGE_KEY } from '@/core/config/keys-config';
import type { ColorScheme } from '@/core/config/ui-config';
import { storageLocal } from '@/core/storage/storage-local';
import type { RouteConfigs } from '@/router/types';
import type { LayoutMode } from '@/shared/utils/layout/layout-mode';

/** 写入 localStorage 的界面偏好 */
export interface PersistedPreferences {
  locale: string;
  colorScheme: ColorScheme;
  navTheme: string;
  primaryColor: string;
  layout: LayoutMode;
  sidebarStatus: boolean;
  weak: boolean;
  hideFooter: boolean;
  multiTags?: RouteConfigs[];
}

/**
 * 读取本机界面偏好
 * @returns 已存对象；无缓存时为 null
 */
export function readSavedPreferences(): Partial<PersistedPreferences> | null {
  const raw = storageLocal().getItem<Partial<PersistedPreferences>>(UI_PREFERENCES_STORAGE_KEY);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  return raw;
}

/**
 * 写入本机界面偏好
 * @param value 完整快照
 */
export function writeSavedPreferences(value: PersistedPreferences): void {
  storageLocal().setItem(UI_PREFERENCES_STORAGE_KEY, value);
}
