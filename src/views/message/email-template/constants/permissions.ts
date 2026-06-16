/**
 * 邮件模板模块按钮权限码（对齐后端 {@code SysEmailTemplateController}）
 */
export const EMAIL_TEMPLATE_PERMS = {
  /** 分页查询 */
  QUERY: 'emailTemplate:query',
  /** 详情、预览、离线渲染 */
  DETAIL: 'emailTemplate:detail',
  /** 新增 */
  CREATE: 'emailTemplate:create',
  /** 编辑、批量启停、测试发送、正文与变量维护 */
  UPDATE: 'emailTemplate:update',
  /** 删除 */
  DELETE: 'emailTemplate:delete',
} as const;
