import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_PREFERENCES_STORAGE_KEY } from '@/core/config/keys-config';
import { DEFAULT_LOCALE } from '@/core/config/locale-config';
import {
  LAYOUT_DEFAULT_MODE,
  THEME_DEFAULT_COLOR_SCHEME,
  THEME_DEFAULT_NAV_THEME,
  THEME_DEFAULT_PRIMARY_COLOR,
} from '@/core/config/ui-config';
import { preferencesPersistencePlugin } from '@/store/modules/preferences/preferences-persistence';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import { useLocalePreferencesStore } from '@/store/modules/preferences/locale-preferences';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';

const memory = new Map<string, unknown>();

vi.mock('@/core/preferences/runtime/layout-override', () => ({
  applyEffectiveLayoutToShell: vi.fn(),
}));

vi.mock('@/core/preferences/runtime/locale-effect', () => ({
  applyLocaleToI18n: vi.fn(),
}));

vi.mock('@/core/storage/storage-local', () => ({
  storageLocal: () => ({
    getItem: <T>(key: string): T | null => (memory.has(key) ? (memory.get(key) as T) : null),
    setItem: <T>(key: string, value: T): void => {
      memory.set(key, value);
    },
    removeItem: (key: string): void => {
      memory.delete(key);
    },
    clear: (): void => {
      memory.clear();
    },
  }),
}));

function bootPreferences() {
  const pinia = createPinia();
  pinia.use(preferencesPersistencePlugin);
  createApp({ render: () => null }).use(pinia);
  setActivePinia(pinia);
  return {
    locale: useLocalePreferencesStore(),
    theme: useThemePreferencesStore(),
    layout: useLayoutPreferencesStore(),
    display: useDisplayPreferencesStore(),
    tags: useTagsPreferencesStore(),
  };
}

describe('preferenceDefaults（出厂值与本机恢复）', () => {
  beforeEach(() => {
    memory.clear();
    bootPreferences();
  });

  it('本机为空时使用出厂值', () => {
    const locale = useLocalePreferencesStore();
    const theme = useThemePreferencesStore();
    const layout = useLayoutPreferencesStore();
    const display = useDisplayPreferencesStore();
    const tags = useTagsPreferencesStore();
    expect(locale.locale).toBe(DEFAULT_LOCALE);
    expect(theme.colorScheme).toBe(THEME_DEFAULT_COLOR_SCHEME);
    expect(theme.navTheme).toBe(THEME_DEFAULT_NAV_THEME);
    expect(theme.primaryColor).toBe(THEME_DEFAULT_PRIMARY_COLOR);
    expect(layout.layout).toBe(LAYOUT_DEFAULT_MODE);
    expect(layout.sidebarStatus).toBe(true);
    expect(display.weak).toBe(false);
    expect(display.hideFooter).toBe(true);
    expect(tags.hasSavedTags).toBe(false);
    expect(theme.osPrefersDark).toBe(false);
  });

  it('本机有值时恢复语言、布局与显示开关', () => {
    memory.set(UI_PREFERENCES_STORAGE_KEY, {
      locale: 'en',
      layout: 'mix',
      sidebarStatus: false,
      weak: true,
      hideFooter: false,
    });
    const stores = bootPreferences();

    expect(stores.locale.locale).toBe('en');
    expect(stores.layout.layout).toBe('mix');
    expect(stores.layout.sidebarStatus).toBe(false);
    expect(stores.display.weak).toBe(true);
    expect(stores.display.hideFooter).toBe(false);
  });

  it('显示开关变更写入同一本机键', () => {
    const display = useDisplayPreferencesStore();
    display.$patch({ weak: true, hideFooter: false });

    expect(memory.get(UI_PREFERENCES_STORAGE_KEY)).toMatchObject({
      weak: true,
      hideFooter: false,
    });
  });
});
