import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_PREFERENCES_STORAGE_KEY } from '@/core/config/keys-config';
import { preferencesPersistencePlugin } from '@/store/modules/preferences/preferences-persistence';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';

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

function useFreshStore() {
  const pinia = createPinia();
  pinia.use(preferencesPersistencePlugin);
  createApp({ render: () => null }).use(pinia);
  setActivePinia(pinia);
  return useTagsPreferencesStore();
}

describe('preferences tags', () => {
  beforeEach(() => {
    memory.clear();
  });

  it('页签写入时去掉函数型 icon，刷新后从同一键恢复', () => {
    const store = useFreshStore();
    store.pushTag({
      path: '/system/user',
      name: 'SystemUser',
      meta: {
        title: 'menus.user',
        icon: () => null,
      },
    });

    const saved = memory.get(UI_PREFERENCES_STORAGE_KEY) as { multiTags: Array<{ meta?: { icon?: unknown } }> };
    expect(saved.multiTags.at(-1)?.meta?.icon).toBeUndefined();

    const restored = useFreshStore();
    expect(restored.hasSavedTags).toBe(true);
    expect(restored.multiTags.some((tag) => tag.path === '/system/user')).toBe(true);
  });

  it('无效页签不视为已保存', () => {
    memory.set(UI_PREFERENCES_STORAGE_KEY, {
      multiTags: [{ name: 'no-path' }],
    });
    const store = useFreshStore();
    expect(store.hasSavedTags).toBe(false);
  });
});
