import { isPermissionVersionMismatchError } from '@/config/http-config';
import { ApiBusinessError, ApiConflictError } from './apiError';
import type { ApiResult } from './apiResult';

/**
 * 根据后端 {@link ApiResult} 构造业务错误；
 * 仅在 HTTP 409 且稳定错误码命中权限版本冲突时，触发权限冲突统一处理。
 */
export function rejectWithApiEnvelopeError(raw: ApiResult, httpStatus?: number): Promise<never> {
  const errorCode = raw.error ?? raw.subCode;
  const isConflict = isPermissionVersionMismatchError(httpStatus, errorCode);
  const err = isConflict ? new ApiConflictError(raw, httpStatus) : new ApiBusinessError(raw, httpStatus);
  return Promise.reject(err);
}
