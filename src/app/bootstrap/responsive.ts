// 响应式storage
import type { App } from 'vue';
import Storage from 'responsive-storage';
import { routerArrays } from '@/layout/types';
import { responsiveStorageNameSpace } from '@/auth/config';
import {
  createDefaultConfigure,
  createDefaultLayout,
  createDefaultLocale,
  DEFAULT_MULTI_TAGS_CACHE,
} from '@/core/preferences/defaults/preference-defaults';

/** 注入后的响应式 $storage，供 preferences 网关在无组件实例时读写 */
let responsiveStorageMemory: ResponsiveStorage | null = null;

/**
 * 获取 responsive-storage 内存对象（优先已注入实例，否则从 localStorage 回退）
 * @returns layout / locale / configure 响应式或快照对象
 */
export function getResponsiveStorage(): ResponsiveStorage {
  if (responsiveStorageMemory) {
    return responsiveStorageMemory;
  }

  const nameSpace = responsiveStorageNameSpace();
  return {
    locale: Storage.getData('locale', nameSpace) ?? createDefaultLocale(),
    layout: Storage.getData('layout', nameSpace) ?? createDefaultLayout(),
    configure: Storage.getData('configure', nameSpace) ?? createDefaultConfigure(),
  };
}

export const injectResponsiveStorage = (app: App) => {
  const nameSpace = responsiveStorageNameSpace();
  const configObj = Object.assign(
    {
      locale: Storage.getData('locale', nameSpace) ?? createDefaultLocale(),
      layout: Storage.getData('layout', nameSpace) ?? createDefaultLayout(),
      configure: Storage.getData('configure', nameSpace) ?? createDefaultConfigure(),
    },
    DEFAULT_MULTI_TAGS_CACHE
      ? {
          tags: Storage.getData('tags', nameSpace) ?? routerArrays,
        }
      : {}
  );

  app.use(Storage, { nameSpace, memory: configObj });
  responsiveStorageMemory = app.config.globalProperties.$storage as ResponsiveStorage;
};
