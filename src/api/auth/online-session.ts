import type { PageResponse } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 全局在线会话分页查询参数（对齐 {@code OnlineSessionPageQuery}）
 */
export interface OnlineSessionPageQuery {
  pageIndex?: number;
  pageSize?: number;
  /** 用户名模糊匹配 */
  username?: string;
  /** IP 地址包含匹配 */
  ipAddress?: string;
}

/**
 * 全局在线会话分页行（对齐 {@code OnlineSessionPageVO}）
 */
export interface OnlineSessionPageRow {
  userId?: string;
  username?: string | null;
  nickname?: string | null;
  sessionId: string;
  ipAddress?: string | null;
  ipRegion?: string | null;
  deviceType?: string | null;
  browserType?: string | null;
  osType?: string | null;
  /** 登录时间戳（毫秒） */
  loginAt?: number | null;
  rememberMe?: boolean | null;
}

/**
 * 全局在线会话统计摘要（对齐 {@code OnlineSessionSummaryVO}）
 */
export interface OnlineSessionSummary {
  sessionCount?: number | null;
}

/**
 * 分页查询全局在线会话
 * @param params 查询参数
 * @returns 分页结果
 */
export function getOnlineSessionPage(params: OnlineSessionPageQuery): Promise<PageResponse<OnlineSessionPageRow>> {
  return http.get<PageResponse<OnlineSessionPageRow>, AxiosRequestConfig<OnlineSessionPageQuery>>(
    'auth/admin/sessions/online',
    { params }
  );
}

/**
 * 查询全局在线会话统计摘要
 * @returns 在线会话索引条数
 */
export function getOnlineSessionSummary(): Promise<OnlineSessionSummary> {
  return http.get<OnlineSessionSummary, AxiosRequestConfig>('auth/admin/sessions/online/summary');
}
