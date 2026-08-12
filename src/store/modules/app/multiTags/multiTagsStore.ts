import { responsiveStorageNameSpace } from '@/auth/config';
import { storageLocal } from '@/core/storage/storageLocal';
import { type RouteConfigs, routerArrays } from '@/layout/types';
import { defineStore } from 'pinia';
import type { TagRouteItem, TagSplicePosition } from '@/store/types';
import { usePermissionStore } from '../../auth/permission';
import { applyPushTag } from './tagPushRules';

export const useMultiTagsStore = defineStore('multi-tags', {
  state: () => ({
    multiTags: (storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.multiTagsCache
      ? storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}tags`)
      : [
          ...routerArrays,
          ...usePermissionStore().flatteningRoutes.filter((v) => v?.meta?.fixedTag),
        ]) as Array<RouteConfigs>,
    multiTagsCache: storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.multiTagsCache,
  }),
  getters: {
    getMultiTagsCache(state) {
      return state.multiTagsCache;
    },
  },
  actions: {
    multiTagsCacheChange(multiTagsCache: boolean) {
      this.multiTagsCache = multiTagsCache;
      if (multiTagsCache) {
        storageLocal().setItem(`${responsiveStorageNameSpace()}tags`, this.multiTags);
      } else {
        storageLocal().removeItem(`${responsiveStorageNameSpace()}tags`);
      }
    },
    setTags(tags: RouteConfigs[]) {
      this.multiTags = tags;
      this.persistTagsCache();
    },
    pushTag(tag: TagRouteItem) {
      const next = applyPushTag(this.multiTags, tag);
      if (!next) {
        return;
      }
      this.multiTags = next;
      this.persistTagsCache();
    },
    removeTags(position: TagSplicePosition) {
      this.multiTags.splice(position?.startIndex, position?.length);
      this.persistTagsCache();
      return this.multiTags;
    },
    getLastTag() {
      return this.multiTags.slice(-1);
    },
    persistTagsCache() {
      if (this.getMultiTagsCache) {
        storageLocal().setItem(`${responsiveStorageNameSpace()}tags`, this.multiTags);
      }
    },
  },
});
