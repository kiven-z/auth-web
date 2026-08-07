import type { InAppTemplateContentType } from '@/api/message/models/in-app-template';

/** 写入撰写表单的定稿字段（模板 / 历史导入共用；不回填分类与链接） */
export interface InAppComposeImportPayload {
  /** 来源模板/场景编码；模板导入有值，历史导入可无 */
  templateCode?: string;
  title: string;
  body: string;
  contentType: InAppTemplateContentType;
}

/** 模板导入结果 */
export type InAppTemplateImportPayload = InAppComposeImportPayload & {
  templateCode: string;
};

/** 历史发送导入结果（不覆盖接收范围） */
export type InAppHistoryImportPayload = InAppComposeImportPayload;
