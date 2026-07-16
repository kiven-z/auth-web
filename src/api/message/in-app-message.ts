import { http } from '@/core/http';

import type { InAppTemplateContentType } from '@/api/message/in-app-template';

/** 站内信接收范围类型 */
export type InAppRecipientScopeType = 'USER' | 'POST' | 'DEPT' | 'ALL';

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
 * 管理端按范围发送站内信
 * @param data 发送请求
 * @returns 发送结果
 */
export function sendInAppMessage(data: InAppComposeRequest): Promise<InAppComposeResult> {
  return http.post<InAppComposeResult, InAppComposeRequest>('/system/message/in-app/send', { data });
}
