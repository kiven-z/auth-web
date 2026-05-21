/**
 * 邮件模板搜索区：状态下拉选项（label 走 i18n key）
 */
export const emailTemplateStatusFilterOptions: ReadonlyArray<{ value: boolean; labelKey: string }> = [
  { value: true, labelKey: 'buttons.statusActiveText' },
  { value: false, labelKey: 'buttons.statusInactiveText' },
];
