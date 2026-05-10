/**
 * 与后端 AuthLoginLogResult.code / AuthLoginLogType 对齐，供筛选与展示。
 */

/** log_login.login_result */
export const LOGIN_LOG_RESULT_CODES = [0, 1, 2, 3, 4] as const;
export type LoginLogResultCode = (typeof LOGIN_LOG_RESULT_CODES)[number];

/** AuthLoginLogType.name() */
export const LOGIN_LOG_TYPE_CODES = ['LOGIN_EMAIL', 'LOGIN_PASSWORD', 'REFRESH_TOKEN', 'LOGOUT'] as const;
export type LoginLogTypeCode = (typeof LOGIN_LOG_TYPE_CODES)[number];
