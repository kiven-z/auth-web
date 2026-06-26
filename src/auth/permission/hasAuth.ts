import { satisfiesAllRequired } from '@/auth/permission/permissionMatcher';
import { useUserStoreHook } from '@/store/modules/user';
import { isString } from '@pureadmin/utils';

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
 * 仅依据当前用户 `permissions` 判断；匹配规则与后端 PermissionMatcher / 管理员通配符一致。
 * 数组入参表示 AND（需同时满足）；用户无权限或未登录时全部按钮隐藏。
 *
 * @param value 单个权限标识或数组（数组表示 AND）
 * @returns 是否拥有权限
 */
function hasAuth(value: string | Array<string>): boolean {
  const required = normalizeRequiredPermissions(value);
  if (required.length === 0) {
    return false;
  }

  const { permissions } = useUserStoreHook();

  if (permissions?.length && satisfiesAllRequired(required, permissions)) {
    return true;
  }

  return false;
}

export { hasAuth };
