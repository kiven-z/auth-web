import { handlePermissionVersionConflict } from '@/infrastructure/permissionConflict';
import { ApiBusinessError, ApiConflictError } from './apiError';
import type { ApiResult } from './apiResult';

/**
 * 根据后端 {@link ApiResult} 构造业务错误；409 / code 409 时触发权限冲突统一处理。
 */
export function rejectWithApiEnvelopeError(raw: ApiResult, httpStatus?: number): Promise<never> {
  const isConflict = httpStatus === 409 || raw.code === 409;
  const err = isConflict ? new ApiConflictError(raw, httpStatus) : new ApiBusinessError(raw, httpStatus);
  if (isConflict) {
    handlePermissionVersionConflict(err as ApiConflictError);
  }
  return Promise.reject(err);
}
