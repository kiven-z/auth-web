import { getInAppInboxUnreadCount } from '@/api/message/in-app-inbox';
import { store } from '@/store';
import { defineStore } from 'pinia';

interface InAppInboxState {
  pullUnreadCount: number;
  pushUnreadCount: number;
  totalUnreadCount: number;
}

export const useInAppInboxStore = defineStore('in-app-inbox', {
  state: (): InAppInboxState => ({
    pullUnreadCount: 0,
    pushUnreadCount: 0,
    totalUnreadCount: 0,
  }),
  actions: {
    /**
     * 从服务端刷新未读角标。
     */
    async refreshUnreadCount() {
      const unreadCount = await getInAppInboxUnreadCount().catch(() => ({
        pullUnreadCount: 0,
        pushUnreadCount: 0,
        totalUnreadCount: 0,
      }));
      Object.assign(this, unreadCount);
    },
  },
});

/**
 * 在组件外获取站内信收件箱 store。
 * @returns Pinia store 实例
 */
export function useInAppInboxStoreHook() {
  return useInAppInboxStore(store);
}
