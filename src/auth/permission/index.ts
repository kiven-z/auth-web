import { router } from '@/router';
import { satisfiesAllRequired } from '@/auth/permission/permissionMatcher';
import { useUserStoreHook } from '@/store/modules/user';
import { isString } from '@pureadmin/utils';

/**
 * 判断两个数组彼此是否存在相同值（供角色交集判断使用）
 * @param first 第一个数组
 * @param second 第二个数组
 * @returns 是否存在相同值
 */
function isOneOfArray(first: Array<string>, second: Array<string>): boolean {
  return Array.isArray(first) && Array.isArray(second) ? first.some((value) => second.includes(value)) : true;
}

/**
 * 将权限入参规范为所需权限列表
 * @param value 权限入参
 * @returns 所需权限列表
 */
function normalizeRequiredPermissions(value: string | Array<string>): string[] {
  if (!value) {
    return [];
  }
  return isString(value) ? [value] : value;
}

/**
 * 是否有按钮级别的权限。
 *
 * 支持两种数据源（按优先级）：
 * 1. 当前路由 `meta.auths` — 适用于页面内按钮级别的精细控制
 * 2. 用户 `permissions` 列表 — 全局统一的权限标识
 *
 * 匹配规则与后端 PermissionMatcher / 管理员通配符一致。
 *
 * @param value 单个权限标识或数组（数组表示 AND）
 * @param source 可选，指定数据源：'route' | 'user' ，默认先查路由再查用户
 * @returns 是否拥有权限
 */
function hasAuth(value: string | Array<string>, source?: 'route' | 'user'): boolean {
  // 将权限入参规范为所需权限列表
  const required = normalizeRequiredPermissions(value);
  // 如果所需权限列表为空，则返回 false
  if (required.length === 0) {
    return false;
  }

  // 如果数据源为 user，则检查用户权限
  if (source !== 'user') {
    const metaAuths = router.currentRoute.value.meta.auths as Array<string> | undefined;

    // 如果路由权限列表不为空且满足所需权限列表，则返回 true
    if (metaAuths?.length && satisfiesAllRequired(required, metaAuths)) {
      return true;
    }
  }

  // 如果数据源为 route，则检查路由权限
  if (source !== 'route') {
    const { permissions } = useUserStoreHook();

    // 如果用户权限列表不为空且满足所需权限列表，则返回 true
    if (permissions?.length && satisfiesAllRequired(required, permissions)) {
      return true;
    }
  }

  return false;
}
export { hasAuth, isOneOfArray };
