import type { ApiResult } from './apiResult';

/**
 * 信封业务码非 0（与后端 {@code Result.SUCCESS_CODE} 一致）或 HTTP 层失败时的可抛出错误，便于页面展示 message / ext。
 */
export class ApiBusinessError extends Error {
  readonly businessCode: number;
  readonly httpStatus?: number;
  readonly result: ApiResult;

  constructor(result: ApiResult, httpStatus?: number) {
    super(result.message ?? 'Request failed');
    this.name = 'ApiBusinessError';
    this.businessCode = result.code;
    this.httpStatus = httpStatus;
    this.result = result;
  }
}

/** 权限版本等冲突，对应 HTTP 409 */
export class ApiConflictError extends ApiBusinessError {
  readonly isPermissionConflict = true;
}
