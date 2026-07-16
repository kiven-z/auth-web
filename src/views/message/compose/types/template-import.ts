import type { InAppTemplateContentType } from '@/api/message/in-app-template';

/** 模板导入结果（写入发送表单定稿字段） */
export interface InAppTemplateImportPayload {
  templateCode: string;
  title: string;
  body: string;
  contentType: InAppTemplateContentType;
}
