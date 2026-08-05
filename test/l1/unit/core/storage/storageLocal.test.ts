import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storageLocal } from '@/core/storage/storageLocal';

/**
 * 内存版 Storage，供 node 环境下验证 JSON 读写行为
 */
function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
  };
}

describe('storageLocal', () => {
  let memoryStorage: Storage;

  beforeEach(() => {
    memoryStorage = createMemoryStorage();
    vi.stubGlobal('window', { localStorage: memoryStorage });
  });

  it('round-trips objects via JSON', () => {
    const api = storageLocal();
    api.setItem('profile', { username: 'alice', roles: ['admin'] });

    expect(memoryStorage.getItem('profile')).toBe(JSON.stringify({ username: 'alice', roles: ['admin'] }));
    expect(api.getItem<{ username: string; roles: string[] }>('profile')).toEqual({
      username: 'alice',
      roles: ['admin'],
    });
  });

  it('returns null for missing keys', () => {
    expect(storageLocal().getItem('missing')).toBeNull();
  });

  it('returns null when stored JSON is corrupt', () => {
    memoryStorage.setItem('broken', '{not-json');
    expect(storageLocal().getItem('broken')).toBeNull();
  });

  it('removeItem deletes a single key', () => {
    const api = storageLocal();
    api.setItem('keep', 1);
    api.setItem('drop', 2);
    api.removeItem('drop');

    expect(api.getItem('keep')).toBe(1);
    expect(api.getItem('drop')).toBeNull();
  });

  it('clear removes all keys in the origin', () => {
    const api = storageLocal();
    api.setItem('a', 1);
    api.setItem('b', 2);
    api.clear();

    expect(api.getItem('a')).toBeNull();
    expect(api.getItem('b')).toBeNull();
  });

  it('no-ops when window is unavailable', () => {
    vi.stubGlobal('window', undefined);
    const api = storageLocal();
    expect(() => api.setItem('x', 1)).not.toThrow();
    expect(api.getItem('x')).toBeNull();
  });
});
