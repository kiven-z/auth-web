import type { InAppTemplateContentType } from '@/api/message/in-app-template';

/** 详情预览正文类型 */
export type MessageTemplateContentTypeCode = InAppTemplateContentType | 'HTML';

/** 站内信正文类型选项 */
export const MESSAGE_TEMPLATE_CONTENT_TYPES: InAppTemplateContentType[] = ['TEXT', 'MARKDOWN'];
