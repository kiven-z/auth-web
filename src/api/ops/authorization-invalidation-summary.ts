import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 授权失效 Outbox 统计
 */
export interface AuthorizationInvalidationOutboxStats {
  totalCount?: number;
  pendingCount?: number;
  processingCount?: number;
  successCount?: number;
  failedCount?: number;
  deadCount?: number;
  failureRatePercent?: number | string;
}

/**
 * 授权失效幂等事件统计
 */
export interface AuthorizationInvalidationEventStats {
  totalCount?: number;
  processingCount?: number;
  completedCount?: number;
}

/**
 * 授权失效运维统计摘要
 */
export interface AuthorizationInvalidationSummary {
  outbox?: AuthorizationInvalidationOutboxStats;
  event?: AuthorizationInvalidationEventStats;
}

/**
 * 查询授权失效运维统计摘要
 * @returns 统计摘要
 */
export function getAuthorizationInvalidationSummary(): Promise<AuthorizationInvalidationSummary> {
  return http.get<AuthorizationInvalidationSummary, AxiosRequestConfig>(
    '/system/ops/authorization-invalidation/summary'
  );
}
