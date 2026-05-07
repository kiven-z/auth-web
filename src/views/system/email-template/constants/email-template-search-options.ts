/**
 * 邮件模板搜索区：状态下拉选项（label 走 i18n key）
 */
export const EMAIL_TEMPLATE_STATUS_FILTER_OPTIONS: ReadonlyArray<{ value: number; labelKey: string }> = [
  { value: 1, labelKey: 'emailTemplate.statusEnabled' },
  { value: 0, labelKey: 'emailTemplate.statusDisabled' },
];
