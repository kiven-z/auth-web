import type { BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 授权失效 Outbox 分页查询参数
 */
export interface AuthorizationInvalidationOutboxPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 业务事件 ID（精确匹配） */
  eventId?: string;
  /** 变更维度（AuthorizationChangeKind） */
  changeKind?: string;
  /** 投递状态 */
  status?: string;
  /** 触发模块 */
  sourceModule?: string;
  /** 业务主键（精确匹配） */
  sourceBizId?: string;
  /** 创建时间（开始） */
  createTimeStart?: string;
  /** 创建时间（结束） */
  createTimeEnd?: string;
  /** 处理完成时间（开始） */
  processedAtStart?: string;
  /** 处理完成时间（结束） */
  processedAtEnd?: string;
}

/**
 * 授权失效 Outbox 分页行
 */
export interface AuthorizationInvalidationOutboxPageRow extends BaseResponsePageRow {
  eventId?: string;
  changeKind?: string;
  status?: string;
  retryCount?: number | null;
  maxRetry?: number | null;
  nextRetryAt?: string | null;
  lastError?: string | null;
  lockedBy?: string | null;
  lockedAt?: string | null;
  processedAt?: string | null;
  sourceModule?: string | null;
  sourceBizId?: string | null;
}

/**
 * 授权失效 Outbox 详情
 */
export interface AuthorizationInvalidationOutboxDetailRow extends AuthorizationInvalidationOutboxPageRow {
  payload?: string | null;
  remark?: string | null;
}

/**
 * 分页查询授权失效 Outbox
 * @param params 分页查询参数
 * @returns 分页结果
 */
export function getAuthorizationInvalidationOutboxPage(
  params: AuthorizationInvalidationOutboxPageQuery
): Promise<PageResponse<AuthorizationInvalidationOutboxPageRow>> {
  return http.get<PageResponse<AuthorizationInvalidationOutboxPageRow>, AxiosRequestConfig>(
    '/system/ops/authorization-invalidation/outbox/page',
    { params }
  );
}

/**
 * 授权失效 Outbox 详情
 * @param id 主键
 * @returns 详情
 */
export function getAuthorizationInvalidationOutboxDetail(
  id: string
): Promise<AuthorizationInvalidationOutboxDetailRow> {
  return http.get<AuthorizationInvalidationOutboxDetailRow, AxiosRequestConfig>(
    `/system/ops/authorization-invalidation/outbox/${id}`
  );
}
