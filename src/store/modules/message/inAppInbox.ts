import { getInAppInboxUnreadCount, type InAppInboxMajorUnread } from '@/api/message/in-app-inbox';
import { defineStore } from 'pinia';

interface InAppInboxState {
  /** 未读总数 */
  totalUnreadCount: number;
  /** 启用大类列表 */
  majors: InAppInboxMajorUnread[];
  /** 大类 / 未读角标加载中 */
  loadingMajors: boolean;
}

export const useInAppInboxStore = defineStore('in-app-inbox', {
  state: (): InAppInboxState => ({
    totalUnreadCount: 0,
    majors: [],
    loadingMajors: false,
  }),
  actions: {
    /**
     * 从服务端刷新未读角标与大类 Tab 数据。
     * 失败时抛出，由调用方决定是否提示（角标静默 / 收件箱页提示）。
     */
    async refreshUnreadCount() {
      this.loadingMajors = true;
      try {
        const unreadCount = await getInAppInboxUnreadCount();
        this.totalUnreadCount = unreadCount.totalUnreadCount ?? 0;
        this.majors = unreadCount.majors ?? [];
      } finally {
        this.loadingMajors = false;
      }
    },
  },
});
