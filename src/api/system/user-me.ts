import type { AxiosRequestConfig } from 'axios';

import type { PageResponse } from '@/api/common';
import { http } from '@/core/http';

/**
 * 个人中心活跃会话（对齐 {@code MeUserSessionVO}）
 */
export interface MeUserSession {
  sessionId: string;
  ipAddress?: string | null;
  ipRegion?: string | null;
  deviceType?: string | null;
  browserType?: string | null;
  osType?: string | null;
  rememberMe?: boolean | null;
  refreshTokenExpiresAt?: number | null;
  /** 登录时间戳（毫秒） */
  loginAt?: number | null;
  /** 是否为当前请求所在会话 */
  current?: boolean | null;
}

/**
 * 个人中心登录日志分页查询参数（对齐 {@code MeLoginLogPageQuery}）
 */
export interface MeLoginLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  loginResult?: number;
  loginType?: string;
}

/**
 * 当前用户资料更新请求（对齐 {@code MeProfileUpdateForm}）
 */
export interface MeProfileUpdateRequest {
  nickname: string;
  email: string;
  phone: string;
  gender?: number | null;
  birthday?: string | null;
  introduction?: string | null;
  avatar?: string | null;
}

/**
 * 个人中心登录日志分页行（对齐 {@code MeLoginLogPageVO}）
 */
export interface MeLoginLogPageRow {
  loginTime: string;
  loginRegion?: string | null;
  loginResult: number;
  loginType?: string | null;
}

/**
 * 更新当前用户个人资料
 * @param data 资料更新表单
 */
export function updateMyProfile(data: MeProfileUpdateRequest): Promise<string> {
  return http.request<string>('put', '/system/user/me/profile', { data });
}

/**
 * 查询当前用户活跃会话列表
 */
export function listMySessions(): Promise<MeUserSession[]> {
  return http.get<MeUserSession[], AxiosRequestConfig>('/system/user/me/sessions');
}

/**
 * 踢出当前用户指定会话
 * @param sessionId 会话 ID（jti）
 */
export function kickMySession(sessionId: string): Promise<void> {
  return http.post<void, unknown>(`/system/user/me/sessions/${sessionId}/kick`);
}

/**
 * 分页查询当前用户登录日志（最近 180 天）
 * @param params 查询参数
 */
export function getMyLoginLogPage(params: MeLoginLogPageQuery): Promise<PageResponse<MeLoginLogPageRow>> {
  return http.get<PageResponse<MeLoginLogPageRow>, AxiosRequestConfig<MeLoginLogPageQuery>>(
    '/system/user/me/login-logs/page',
    { params }
  );
}
