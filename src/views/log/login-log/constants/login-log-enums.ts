import type { TagProps } from 'element-plus';

/** ElTag type，与 element-plus TagProps 一致 */
export type LoginLogResultTagType = NonNullable<TagProps['type']>;

/** log_login.login_result ↔ AuthLoginLogResult.code */
export const LOGIN_LOG_RESULT_ITEMS = [
  { code: 0, tagType: 'success' },
  { code: 1, tagType: 'danger' },
  { code: 2, tagType: 'warning' },
  { code: 3, tagType: 'info' },
  { code: 4, tagType: 'info' },
] as const satisfies ReadonlyArray<{ code: number; tagType: LoginLogResultTagType }>;

/**
 * 解析登录结果展示元数据
 * @param code 登录结果码
 */
export function resolveLoginLogResultMeta(code: number) {
  return LOGIN_LOG_RESULT_ITEMS.find((item) => item.code === code);
}

// AuthLoginLogType.name()
export const LOGIN_LOG_TYPE_CODES = ['LOGIN_EMAIL', 'LOGIN_SMS', 'LOGIN_PASSWORD', 'REFRESH_TOKEN', 'LOGOUT'] as const;
