import type { BaseResponsePageRow, PageResponse } from '@/api/common';
import type { InAppDeliveryMode } from '@/api/message/in-app-message';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

/** 我的站内信分页查询参数 */
export interface InAppInboxPageQuery {
  pageIndex?: number;
  pageSize?: number;
  /** 投递模式 */
  deliveryMode: InAppDeliveryMode;
  isRead?: boolean;
  bizType?: string;
  /** 标题关键字 */
  title?: string;
}

/** 我的站内信分页行 */
export interface InAppInboxPageRow extends BaseResponsePageRow {
  sceneCode?: string | null;
  title: string;
  contentType: string;
  bizType?: string | null;
  linkUrl?: string | null;
  /** 发起人用户 ID（雪花，字符串） */
  senderUserId?: string | null;
  deliveryMode: InAppDeliveryMode | string;
  isRead: boolean;
  readTime?: string | null;
}

/** 我的站内信未读角标 */
export interface InAppInboxUnreadCount {
  pullUnreadCount: number;
  pushUnreadCount: number;
  totalUnreadCount: number;
}

/**
 * 分页查询我的站内信。
 * @param params 分页与筛选参数
 * @returns 收件箱分页数据
 */
export function getInAppInboxPage(params: InAppInboxPageQuery): Promise<PageResponse<InAppInboxPageRow>> {
  return http.get<PageResponse<InAppInboxPageRow>, AxiosRequestConfig<InAppInboxPageQuery>>(
    '/system/me/message/in-app/inbox',
    { params }
  );
}

/**
 * 查询我的站内信未读角标。
 * @returns 公开/定向未读及总数
 */
export function getInAppInboxUnreadCount(): Promise<InAppInboxUnreadCount> {
  return http.get<InAppInboxUnreadCount, AxiosRequestConfig>('/system/me/message/in-app/inbox/unread-count');
}
