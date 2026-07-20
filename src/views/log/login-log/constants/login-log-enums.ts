import type { TagProps } from 'element-plus';

/** ElTag type，与 element-plus TagProps 一致 */
export type LoginLogResultTagType = NonNullable<TagProps['type']>;

/** 登录结果展示项 */
export const LOGIN_LOG_RESULT_ITEMS = [
  { code: 0, labelKey: 'loginLog.result.success', tagType: 'success' as const },
  { code: 1, labelKey: 'loginLog.result.badCredential', tagType: 'danger' as const },
  { code: 2, labelKey: 'loginLog.result.accountLocked', tagType: 'warning' as const },
  { code: 3, labelKey: 'loginLog.result.captchaError', tagType: 'info' as const },
  { code: 4, labelKey: 'loginLog.result.accountDisabled', tagType: 'info' as const },
] as const satisfies ReadonlyArray<{ code: number; labelKey: string; tagType: LoginLogResultTagType }>;

/**
 * 解析登录结果展示元数据
 * @param code 登录结果码
 */
export function resolveLoginLogResultMeta(code: number) {
  return LOGIN_LOG_RESULT_ITEMS.find((item) => item.code === code);
}

/** 登录类型筛选项 */
export const LOGIN_LOG_TYPE_FILTER_OPTIONS = [
  { value: 'LOGIN_EMAIL', labelKey: 'loginLog.type.LOGIN_EMAIL' },
  { value: 'LOGIN_SMS', labelKey: 'loginLog.type.LOGIN_SMS' },
  { value: 'LOGIN_PASSWORD', labelKey: 'loginLog.type.LOGIN_PASSWORD' },
  { value: 'REFRESH_TOKEN', labelKey: 'loginLog.type.REFRESH_TOKEN' },
  { value: 'LOGOUT', labelKey: 'loginLog.type.LOGOUT' },
] as const;
