import { AUTH_RECOVERY_RULE_IDS } from '@/config/auth/auth-recovery-rule-ids';
import { ASYNC_ROUTES_STORAGE_KEY } from '@/config/http-config';
import { message } from '@/ui/feedback/message';
import { storageLocal } from '@pureadmin/utils';

/** 恢复提示 Toast 展示时长（毫秒） */
const RECOVERY_TOAST_DURATION_MS = 5000;

/**
 * 鉴权恢复流程开始时的应用层副作用（Toast、清理路由缓存等）。
 * 与 infrastructure 内纯策略规则解耦，由 HTTP 拦截器在恢复执行前调用。
 * @param matchedRuleId 命中的规则 ID（见 {@link AUTH_RECOVERY_RULE_IDS}）
 */
export function runAuthRecoverySideEffect(matchedRuleId: string): void {
  switch (matchedRuleId) {
    case AUTH_RECOVERY_RULE_IDS.TOKEN_EXPIRED_REFRESH: {
      message('访问令牌过期或失效，若尝试刷新失败，请重新登录后重试', {
        type: 'warning',
        duration: RECOVERY_TOAST_DURATION_MS,
      });
      return;
    }

    case AUTH_RECOVERY_RULE_IDS.PERMISSION_MISMATCH_REFRESH: {
      storageLocal().removeItem(ASYNC_ROUTES_STORAGE_KEY);
      message('权限已更新，若刷新失败，请重新登录后重试', {
        type: 'warning',
        duration: RECOVERY_TOAST_DURATION_MS,
      });
      return;
    }

    default:
      // 登出、透传等规则无需恢复提示
      return;
  }
}
