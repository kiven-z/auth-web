import { router } from '@/router';
import { useUserStoreHook } from '@/store/modules/user';
import { isIncludeAllChildren, isString } from '@pureadmin/utils';

/**
 * 判断两个数组彼此是否存在相同值（供角色交集判断使用）。
 */
function isOneOfArray(a: Array<string>, b: Array<string>): boolean {
  return Array.isArray(a) && Array.isArray(b) ? a.some((v) => b.includes(v)) : true;
}

/**
 * 是否有按钮级别的权限。
 *
 * 支持两种数据源（按优先级）：
 * 1. 当前路由 `meta.auths` — 适用于页面内按钮级别的精细控制
 * 2. 用户 `permissions` 列表 — 全局统一的权限标识
 *
 * @param value 单个权限标识或数组
 * @param source 可选，指定数据源：'route' | 'user' ，默认先查路由再查用户
 */
function hasAuth(value: string | Array<string>, source?: 'route' | 'user'): boolean {
  if (!value) return false;

  // 优先从路由 meta 获取
  if (source !== 'user') {
    const metaAuths = router.currentRoute.value.meta.auths as Array<string> | undefined;
    if (metaAuths) {
      return isString(value) ? metaAuths.includes(value) : isIncludeAllChildren(value, metaAuths);
    }
  }

  // 从用户权限列表获取
  if (source !== 'route') {
    const allPerms = '*:*:*';
    const { permissions } = useUserStoreHook();
    if (!permissions || permissions.length === 0) return false;
    if (permissions.length === 1 && permissions[0] === allPerms) return true;
    return isString(value) ? permissions.includes(value) : isIncludeAllChildren(value, permissions);
  }

  return false;
}

/**
 * 获取当前页面按钮级别的权限（从路由 meta 获取）。
 */
function getAuths(): Array<string> {
  return router.currentRoute.value.meta.auths as Array<string>;
}

export { getAuths, hasAuth, isOneOfArray };
