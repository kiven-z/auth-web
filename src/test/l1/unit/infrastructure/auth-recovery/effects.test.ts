import { dispatchAuthRecoveryEffects } from '@/infrastructure/auth-flow/recovery/effects';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { handlePermissionVersionConflictMock } = vi.hoisted(() => ({
  handlePermissionVersionConflictMock: vi.fn(),
}));

vi.mock('@/infrastructure/permissionConflict', () => ({
  handlePermissionVersionConflict: handlePermissionVersionConflictMock,
}));

describe('dispatchAuthRecoveryEffects', () => {
  beforeEach(() => {
    handlePermissionVersionConflictMock.mockReset();
  });

  it('triggers permission conflict side effect on pass-through conflict envelope', () => {
    dispatchAuthRecoveryEffects({
      context: {
        status: 409,
        errorCode: 'PERMISSION_VERSION_MISMATCH',
      },
      recoveryResult: {
        handled: false,
        action: 'pass_through',
      },
      envelope: {
        code: 406,
        message: 'permission mismatch',
        error: 'PERMISSION_VERSION_MISMATCH',
        subCode: 'PERMISSION_VERSION_MISMATCH',
        timestamp: Date.now(),
        data: null,
      },
    });

    expect(handlePermissionVersionConflictMock).toHaveBeenCalledTimes(1);
  });

  it('does not trigger side effect when recovery already handled', () => {
    dispatchAuthRecoveryEffects({
      context: {
        status: 409,
        errorCode: 'PERMISSION_VERSION_MISMATCH',
      },
      recoveryResult: {
        handled: true,
        action: 'refresh_and_retry',
      },
      envelope: {
        code: 406,
        message: 'permission mismatch',
        error: 'PERMISSION_VERSION_MISMATCH',
        subCode: 'PERMISSION_VERSION_MISMATCH',
        timestamp: Date.now(),
        data: null,
      },
    });

    expect(handlePermissionVersionConflictMock).not.toHaveBeenCalled();
  });
});
