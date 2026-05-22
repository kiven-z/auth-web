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

export type LoginLogResultCode = (typeof LOGIN_LOG_RESULT_ITEMS)[number]['code'];

/** 筛选项遍历用，顺序与 {@link LOGIN_LOG_RESULT_ITEMS} 一致 */
export const LOGIN_LOG_RESULT_CODES = LOGIN_LOG_RESULT_ITEMS.map((item) => item.code) as readonly LoginLogResultCode[];

export const LOGIN_LOG_RESULT_TAG_MAP = Object.fromEntries(
  LOGIN_LOG_RESULT_ITEMS.map((item) => [item.code, item.tagType])
) as Record<LoginLogResultCode, LoginLogResultTagType>;

/** 未知结果码时回退为 info */
export function getLoginLogResultTagType(code: number): LoginLogResultTagType {
  return LOGIN_LOG_RESULT_TAG_MAP[code as LoginLogResultCode] ?? 'info';
}

// AuthLoginLogType.name()
export const LOGIN_LOG_TYPE_CODES = ['LOGIN_EMAIL', 'LOGIN_SMS', 'LOGIN_PASSWORD', 'REFRESH_TOKEN', 'LOGOUT'] as const;
