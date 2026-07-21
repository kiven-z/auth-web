import { getInAppInboxUnreadCount, type InAppInboxMajorUnread } from '@/api/message/in-app-inbox';
import { store } from '@/store';
import { defineStore } from 'pinia';

interface InAppInboxState {
  /** 未读总数 */
  totalUnreadCount: number;
  /** 启用大类列表 */
  majors: InAppInboxMajorUnread[];
}

export const useInAppInboxStore = defineStore('in-app-inbox', {
  state: (): InAppInboxState => ({
    totalUnreadCount: 0,
    majors: [],
  }),
  actions: {
    /**
     * 从服务端刷新未读角标与大类 Tab 数据。
     * 失败时抛出，由调用方决定是否提示（角标静默 / 收件箱页提示）。
     */
    async refreshUnreadCount() {
      const unreadCount = await getInAppInboxUnreadCount();
      this.totalUnreadCount = unreadCount.totalUnreadCount ?? 0;
      this.majors = unreadCount.majors ?? [];
    },
  },
});

/**
 * 在组件外获取站内信收件箱 store
 * @returns Pinia store 实例
 */
export function useInAppInboxStoreHook() {
  return useInAppInboxStore(store);
}
