import { isPermissionVersionMismatchError } from '@/config/http-config';
import type { ApiConflictError } from '@/infrastructure/http/apiError';
import { ApiConflictError as ApiConflictErrorCtor } from '@/infrastructure/http/apiError';
import type { ApiResult } from '@/infrastructure/http/apiResult';
import { handlePermissionVersionConflict } from '@/infrastructure/permissionConflict';
import type { RecoveryAction } from './types';

interface AuthRecoveryEffectContext {
  status?: number;
  errorCode?: string;
}

interface AuthRecoveryEffectResult {
  handled: boolean;
  action: RecoveryAction;
}

export interface DispatchAuthRecoveryEffectsInput {
  context: AuthRecoveryEffectContext;
  recoveryResult: AuthRecoveryEffectResult;
  envelope?: ApiResult;
}

/**
 * 统一恢复副作用分发：
 * - auth-recovery 负责动作决策与执行
 * - 副作用（例如权限冲突提示）在此处统一触发，避免散落在异常构造层
 */
export function dispatchAuthRecoveryEffects(input: DispatchAuthRecoveryEffectsInput): void {
  if (!input.envelope) {
    return;
  }
  const isPermissionConflict = isPermissionVersionMismatchError(input.context.status, input.context.errorCode);
  const shouldHandleConflict =
    isPermissionConflict && !input.recoveryResult.handled && input.recoveryResult.action === 'pass_through';
  if (!shouldHandleConflict) {
    return;
  }
  const conflictError: ApiConflictError = new ApiConflictErrorCtor(input.envelope, input.context.status);
  handlePermissionVersionConflict(conflictError);
}
