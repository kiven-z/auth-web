import type { BaseResponseDetail, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import type { InAppTemplateContentType } from '@/api/message/in-app-template';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

/** 站内信接收范围类型 */
export type InAppRecipientScopeType = 'USER' | 'POST' | 'DEPT' | 'ALL';

/** 站内信发送来源 */
export type InAppMessageSourceType = 'ADMIN_COMPOSE' | 'TEMPLATE' | 'SYSTEM';

/** 站内信投递模式 */
export type InAppDeliveryMode = 'PULL' | 'PUSH';

/** 站内信发送任务状态 */
export type InAppMessageStatusCode =
  | 'PENDING'
  | 'SENDING'
  | 'SUCCESS'
  | 'PARTIAL'
  | 'FAILED'
  | 'NO_RECIPIENTS'
  | 'RECALLED';

/**
 * 管理端站内信按范围发送请求
 */
export interface InAppComposeRequest {
  recipientScopeType: InAppRecipientScopeType;
  /** USER/POST/DEPT 必填；ALL 可省略 */
  recipientScopeIds?: string[];
  /** 仅 DEPT 有效，默认 true */
  includeChildren?: boolean;
  /** 可选，仅作起草来源溯源 */
  templateCode?: string;
  title: string;
  body: string;
  contentType: InAppTemplateContentType;
  bizType?: string;
  linkUrl?: string;
}

/**
 * 站内信发送结果
 */
export interface InAppComposeResult {
  taskId: string;
  totalCount: number;
  successCount: number;
  status: string;
}

/**
 * 站内信发送任务分页查询参数
 */
export interface InAppSendTaskPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  status?: InAppMessageStatusCode | string;
  sourceType?: InAppMessageSourceType | string;
  recipientScopeType?: InAppRecipientScopeType | string;
  deliveryMode?: InAppDeliveryMode | string;
  bizType?: string;
  /** 标题关键字（模糊） */
  title?: string;
}

/**
 * 站内信发送任务分页行
 */
export interface InAppSendTaskPageRow extends BaseResponsePageRow {
  sourceType: InAppMessageSourceType | string;
  sceneCode?: string | null;
  title: string;
  contentType: InAppTemplateContentType | string;
  bizType?: string | null;
  /** 发起人用户 ID（雪花，字符串） */
  senderUserId?: string | null;
  recipientScopeType: InAppRecipientScopeType | string;
  deliveryMode: InAppDeliveryMode | string;
  totalCount: number;
  successCount: number;
  failCount: number;
  status: InAppMessageStatusCode | string;
  recalledAt?: string | null;
}

/**
 * 站内信发送任务详情
 */
export interface InAppSendTaskDetailVO extends BaseResponseDetail {
  sourceType: InAppMessageSourceType | string;
  sceneCode?: string | null;
  title: string;
  contentType: InAppTemplateContentType | string;
  /** 定稿正文 */
  content: string;
  bizType?: string | null;
  linkUrl?: string | null;
  /** 发起人用户 ID（雪花，字符串） */
  senderUserId?: string | null;
  recipientScopeType: InAppRecipientScopeType | string;
  /** 接收范围快照原始 JSON */
  recipientScopeJson?: string | null;
  /** 范围 ID 列表（由快照解析；ALL 为空） */
  recipientScopeIds?: string[] | null;
  /** 仅 DEPT 有值 */
  includeChildren?: boolean | null;
  deliveryMode: InAppDeliveryMode | string;
  totalCount: number;
  successCount: number;
  failCount: number;
  status: InAppMessageStatusCode | string;
  recalledAt?: string | null;
  /** 撤回操作人用户 ID（雪花，字符串） */
  recallUserId?: string | null;
  remark?: string | null;
}

/**
 * 管理端按范围发送站内信
 * @param data 发送请求
 * @returns 发送结果
 */
export function sendInAppMessage(data: InAppComposeRequest): Promise<InAppComposeResult> {
  return http.post<InAppComposeResult, InAppComposeRequest>('/system/message/in-app/send', { data });
}

/**
 * 分页查询站内信发送任务
 * @param params 查询参数
 * @returns 发送任务分页数据
 */
export function getInAppSendTaskPage(params: InAppSendTaskPageQuery) {
  return http.get<PageResponse<InAppSendTaskPageRow>, AxiosRequestConfig<InAppSendTaskPageQuery>>(
    '/system/message/in-app/tasks',
    { params }
  );
}

/**
 * 按任务 ID 查询站内信发送任务详情
 * @param taskId 任务 ID（雪花，字符串传递）
 * @returns 发送任务详情
 */
export function getInAppSendTaskById(taskId: string) {
  return http.get<InAppSendTaskDetailVO, AxiosRequestConfig>(`/system/message/in-app/tasks/${taskId}`);
}

/**
 * 补发站内信发送任务（仅 PUSH 定向任务）
 * @param taskId 任务 ID（雪花，字符串传递）
 */
export function retryInAppSendTask(taskId: string) {
  return http.post<void, undefined>(`/system/message/in-app/tasks/${taskId}/retry`);
}

/**
 * 撤回站内信发送任务（SUCCESS / PARTIAL / NO_RECIPIENTS）
 * @param taskId 任务 ID（雪花，字符串传递）
 */
export function recallInAppSendTask(taskId: string) {
  return http.post<void, undefined>(`/system/message/in-app/tasks/${taskId}/recall`);
}

/**
 * 批量删除站内信发送任务（仅终态可删）
 * @param ids 任务 ID 数组（雪花，字符串传递）
 */
export function batchDeleteInAppSendTasks(ids: string[]) {
  return http.request<string>('delete', '/system/message/in-app/tasks', { data: ids });
}
