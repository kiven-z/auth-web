import type { BaseResponsePageRow, PageResponse } from '@/api/common';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

/** 我的站内信分页查询参数 */
export interface InAppInboxPageQuery {
  pageIndex?: number;
  pageSize?: number;
  /** 业务大类 ID（Tab） */
  majorCategoryId?: string;
  /** 业务小类 ID */
  categoryId?: string;
  isRead?: boolean;
  /** 标题关键字 */
  title?: string;
}

/** 我的站内信分页行 */
export interface InAppInboxPageRow extends BaseResponsePageRow {
  sceneCode?: string | null;
  title: string;
  contentType: string;
  categoryId?: string | null;
  categoryName?: string | null;
  linkUrl?: string | null;
  /** 发起人用户 ID */
  senderUserId?: string | null;
  isRead: boolean;
  readTime?: string | null;
}

/** 大类 Tab / 未读项 */
export interface InAppInboxMajorUnread {
  majorCategoryId: string;
  majorCategoryName: string;
  majorCategoryCode: string;
  unreadCount: number;
}

/** 我的站内信未读角标 */
export interface InAppInboxUnreadCount {
  totalUnreadCount: number;
  /** 启用大类全量 */
  majors: InAppInboxMajorUnread[];
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
 * 查询我的站内信未读角标
 * @returns 未读统计
 */
export function getInAppInboxUnreadCount(): Promise<InAppInboxUnreadCount> {
  return http.get<InAppInboxUnreadCount, AxiosRequestConfig>('/system/me/message/in-app/inbox/unread-count');
}
