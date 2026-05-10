/**
 * 登录日志 API
 *
 * 约定后端 LogLoginController：/api/system/log/login（前端 baseURL 已含前缀时路径为 /system/log/login）
 */
import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/** 登录日志分页查询参数 */
export interface LoginLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 用户 ID（远程搜索选中） */
  userId?: string;
  loginTimeStart?: string;
  loginTimeEnd?: string;
  /** 与 log_login.login_result 一致：0–4 */
  loginResult?: number;
  /** 与 AuthLoginLogType.name() 一致，如 LOGIN_PASSWORD */
  loginType?: string;
}

/** 登录日志分页行 */
export interface LoginLogPageRow {
  id: string;
  userId?: string;
  /** 关联用户展示名（非表字段 username） */
  username?: string | null;
  loginResult: number;
  loginTime: string;
  loginRegion?: string | null;
  loginType?: string | null;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/** 登录日志详情 */
export interface LoginLogDetailRow {
  id: string;
  userId?: string;
  username?: string | null;
  loginResult: number;
  failureReason?: string | null;
  loginTime: string;
  loginIp?: string;
  loginRegion?: string | null;
  userAgent?: string | null;
  loginType?: string | null;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 分页查询登录日志
 */
export function getLoginLogPage(params: LoginLogPageQuery): Promise<PageResponse<LoginLogPageRow>> {
  return http.get<PageResponse<LoginLogPageRow>, AxiosRequestConfig<LoginLogPageQuery>>('/system/log/login/page', {
    params,
  });
}

/**
 * 登录日志详情
 */
export function getLoginLogDetail(id: string): Promise<LoginLogDetailRow> {
  return http.get<LoginLogDetailRow, AxiosRequestConfig>(`/system/log/login/${id}`);
}

/**
 * 批量删除登录日志
 */
export function deleteLoginLog(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/log/login', { data: ids });
}
