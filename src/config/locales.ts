/** 支持的语言配置列表 */
export const localeOptions = [
  {
    locale: 'zh',
    label: '简体中文',
  },
  {
    locale: 'en',
    label: 'English',
  },
] as const;

export type LocaleType = (typeof localeOptions)[number]['locale'];
