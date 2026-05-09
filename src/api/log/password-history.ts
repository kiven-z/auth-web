/**
 * 密码历史日志 API
 *
 * 对应后端 LogUserPasswordHistoryController (/api/system/log/password-history)
 */
import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/** 密码历史日志分页查询参数（对应后端 LogUserPasswordHistoryQuery） */
export interface PasswordHistoryPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  userId?: string;
  changeTimeStart?: string;
  changeTimeEnd?: string;
  changeIp?: string;
}

/** 密码历史日志分页行（对应后端 LogUserPasswordHistoryPageVO） */
export interface PasswordHistoryPageRow {
  id: string;
  userId: string;
  username: string;
  changeTime: string;
  changeIp: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/** 密码历史日志详情（对应后端 LogUserPasswordHistoryDetailVO） */
export interface PasswordHistoryDetailRow {
  id: string;
  username: string;
  changeTime: string;
  changeIp: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 分页查询密码历史日志
 * @param params 查询与分页条件
 */
export function getPasswordHistoryPage(
  params: PasswordHistoryPageQuery
): Promise<PageResponse<PasswordHistoryPageRow>> {
  return http.get<PageResponse<PasswordHistoryPageRow>, AxiosRequestConfig<PasswordHistoryPageQuery>>(
    '/system/log/password-history/page',
    { params }
  );
}

/**
 * 查询密码历史日志详情
 * @param id 日志ID
 */
export function getPasswordHistoryDetail(id: string): Promise<PasswordHistoryDetailRow> {
  return http.get<PasswordHistoryDetailRow, AxiosRequestConfig>(`/system/log/password-history/${id}`);
}

/**
 * 批量删除密码历史日志
 * @param ids 日志ID 数组
 */
export function deletePasswordHistory(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/log/password-history', { data: ids });
}
