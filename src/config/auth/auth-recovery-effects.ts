import { ASYNC_ROUTES_STORAGE_KEY } from '@/config/http-config';
import { message } from '@/shared/messaging/message';
import { storageLocal } from '@pureadmin/utils';

/** 需要展示恢复提示的规则 ID */
const TOKEN_EXPIRED_RULE_ID = 'refresh-on-token-expired-or-session-missing';
const PERMISSION_MISMATCH_RULE_ID = 'refresh-on-permission-version-mismatch';

/**
 * 鉴权恢复流程开始时的应用层副作用（Toast、清理路由缓存等）。
 * 与 infrastructure 内纯策略规则解耦，由 HTTP 拦截器在恢复执行前调用。
 * @param matchedRuleId 命中的规则 ID
 */
export function runAuthRecoverySideEffect(matchedRuleId: string): void {
  if (matchedRuleId === TOKEN_EXPIRED_RULE_ID) {
    message('访问令牌过期或失效，若尝试刷新失败，请重新登录后重试', {
      type: 'warning',
      duration: 5000,
    });
    return;
  }
  if (matchedRuleId === PERMISSION_MISMATCH_RULE_ID) {
    storageLocal().removeItem(ASYNC_ROUTES_STORAGE_KEY);
    message('权限已更新，若刷新失败，请重新登录后重试', {
      type: 'warning',
      duration: 5000,
    });
  }
}
