import type { PageResponse } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 在线用户分页查询参数（对齐 {@code OnlineUserPageQuery}）
 */
export interface OnlineUserPageQuery {
  pageIndex?: number;
  pageSize?: number;
  userId?: string;
}

/**
 * 在线用户分页行（对齐 {@code OnlineUserPageVO}）
 */
export interface OnlineUserPageRow {
  userId?: string;
  username?: string | null;
  nickname?: string | null;
  activeSessionCount?: number | null;
  /** 最近登录时间戳（毫秒） */
  lastLoginAt?: number | null;
}

/**
 * 在线用户统计摘要（对齐 {@code OnlineUserSummaryVO}）
 */
export interface OnlineUserSummary {
  onlineUserCount?: number | null;
}

/**
 * 分页查询在线用户
 * @param params 查询参数
 * @returns 分页结果
 */
export function getOnlineUserPage(params: OnlineUserPageQuery): Promise<PageResponse<OnlineUserPageRow>> {
  return http.get<PageResponse<OnlineUserPageRow>, AxiosRequestConfig<OnlineUserPageQuery>>('auth/admin/users/online', {
    params,
  });
}

/**
 * 查询在线用户统计摘要
 * @returns 在线用户数
 */
export function getOnlineUserSummary(): Promise<OnlineUserSummary> {
  return http.get<OnlineUserSummary, AxiosRequestConfig>('auth/admin/users/online/summary');
}
