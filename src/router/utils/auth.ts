import { router } from '../index';

/**
 * 获取当前页面按钮级别的权限（从路由 meta 获取）。
 */
function getAuths(): Array<string> {
  return router.currentRoute.value.meta.auths as Array<string>;
}

/**
 * 是否有按钮级别的权限（基于路由 meta.auths）。
 *
 * @deprecated 请使用 `@/shared/permission` 中的 `hasAuth`，它同时支持路由 meta 和用户权限列表两种数据源。
 */
export { hasAuth, isOneOfArray } from '@/shared/permission';

export { getAuths };
