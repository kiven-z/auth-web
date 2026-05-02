import { storageLocal } from '@pureadmin/utils';
import { message } from '@/shared/messaging/message';
import type { ApiConflictError } from '@/infrastructure/http/apiError';

const ASYNC_ROUTES_STORAGE_KEY = 'async-routes';

/**
 * 权限版本与 JWT 不一致（HTTP 409 / 业务冲突）时的统一处理：
 * 清除本地缓存的动态路由，提示用户刷新或重新拉取菜单。
 */
export function handlePermissionVersionConflict(err: ApiConflictError): void {
  storageLocal().removeItem(ASYNC_ROUTES_STORAGE_KEY);
  message(err.message || '权限已更新，请刷新页面或重新登录后重试', {
    type: 'warning',
    duration: 5000,
  });
}
