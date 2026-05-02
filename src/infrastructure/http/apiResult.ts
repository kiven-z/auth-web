/**
 * 对齐后端 {@code com.auth.common.core.model.response.Result}
 * 与 auth 模块错误响应 ext 中的 i18n 元数据。
 */
export type ResultExt = {
  i18nKey?: string;
  i18nArgs?: unknown[];
  [key: string]: unknown;
};

export interface ApiResult<T = unknown> {
  code: number;
  message?: string;
  error?: string;
  subCode?: string;
  data?: T;
  ext?: ResultExt;
  timestamp?: number;
}

export function isApiResultEnvelope(value: unknown): value is ApiResult {
  return (
    typeof value === 'object' && value !== null && 'code' in value && typeof (value as ApiResult).code === 'number'
  );
}
