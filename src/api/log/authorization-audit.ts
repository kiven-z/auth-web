import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 权限决策审计分页查询参数
 */
export interface AuthorizationAuditQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  // 事件类型：GRANTED / DENIED
  eventType?: string;
  // 决策原因枚举（精确匹配，如 MATCHED、ACCESS_DENIED、UNAUTHENTICATED 等）
  decisionReason?: string;
  className?: string;
  // 操作人用户
  createUserId?: string;
}

/**
 * 权限决策审计分页行
 */
export interface AuthorizationAuditPageRow {
  id: string;
  //事件类型：GRANTED / DENIED
  eventType: string;
  //决策原因枚举值
  decisionReason: string;
  //Controller 类名
  className?: string | null;
  //方法名
  methodName?: string | null;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 权限决策审计详情
 */
export interface AuthorizationAuditDetailRow {
  id: string;
  // 事件类型：GRANTED / DENIED
  eventType: string;
  // 会话 ID
  sessionId?: string | null;
  // 所需权限码（如 sys:user:add）
  requiredPermission?: string | null;
  // HTTP 方法
  requestMethod?: string | null;
  // 请求 URI
  requestUri?: string | null;
  // 请求 IP（详情展示已脱敏）
  requestIp?: string | null;
  // 决策原因枚举值
  decisionReason: string;
  // 决策详情（可空）
  decisionDetail?: string | null;
  // 用户权限摘要（可空）
  userPermissionsSummary?: string | null;
  // 策略编码（可空）
  policyCode?: string | null;
  // 策略决策结果（可空）
  policyDecision?: boolean | null;
  // Controller 类名
  className?: string | null;
  // 方法名
  methodName?: string | null;
  // 方法参数摘要 JSON（最大约 2KB）
  methodParams?: string | null;
  // 异常消息（最大约 2KB）
  exceptionMessage?: string | null;
  // 备注
  remark?: string | null;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 分页查询权限决策审计日志
 * @param params 分页查询参数
 * @returns 权限决策审计分页行
 */
export function getAuthorizationAuditPage(
  params: AuthorizationAuditQuery
): Promise<PageResponse<AuthorizationAuditPageRow>> {
  return http.get<PageResponse<AuthorizationAuditPageRow>, AxiosRequestConfig<AuthorizationAuditQuery>>(
    '/system/log/authorization-audit/page',
    { params }
  );
}

/**
 * 权限决策审计详情
 * @param id 日志 ID
 * @returns 权限决策审计详情
 */
export function getAuthorizationAuditDetail(id: string): Promise<AuthorizationAuditDetailRow> {
  return http.get<AuthorizationAuditDetailRow, AxiosRequestConfig>(`/system/log/authorization-audit/${id}`);
}

/**
 * 批量删除权限决策审计日志
 * @param ids 日志 ID 数组
 * @returns 删除响应
 */
export function deleteAuthorizationAudit(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/log/authorization-audit', { data: ids });
}
