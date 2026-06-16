import { SYS_SESSION_PERMS } from '@/views/system/_shared/constants/session-permissions';

/**
 * 用户管理模块按钮权限码（对齐后端 {@code SysUserController}、{@code AdminSessionController}、
 * {@code AdminAuthorizationController}）
 */
export const SYS_USER_PERMS = {
  /** 分页查询、用户档案查看 */
  QUERY: 'sysUser:query',
  /** 新增用户 */
  CREATE: 'sysUser:create',
  /** 编辑、批量状态、管理员重置密码 */
  UPDATE: 'sysUser:update',
  /** 删除用户 */
  DELETE: 'sysUser:delete',
  /** Excel 导出 */
  EXPORT: 'sysUser:export',
  ...SYS_SESSION_PERMS,
  /** 刷新用户授权画像缓存 */
  AUTH_REFRESH: 'ADMIN',
} as const;

/**
 * 用户角色分配权限码（对齐后端 {@code SysUserRoleController}）
 */
export const SYS_USER_ROLE_PERMS = {
  /** 查询已分配角色 */
  QUERY: 'sysUserRole:query',
  /** 保存角色分配 */
  UPDATE: 'sysUserRole:update',
} as const;

/**
 * 用户部门关联权限码（对齐后端 {@code SysUserDeptController}）
 */
export const SYS_USER_DEPT_PERMS = {
  /** 分页查询用户部门关联 */
  QUERY: 'sysUserDept:query',
  /** 新增用户部门关联 */
  CREATE: 'sysUserDept:create',
  /** 更新用户部门关联 */
  UPDATE: 'sysUserDept:update',
  /** 删除用户部门关联、清空全部 */
  DELETE: 'sysUserDept:delete',
} as const;

/**
 * 用户岗位关联权限码（对齐后端 {@code SysUserPostController}）
 */
export const SYS_USER_POST_PERMS = {
  /** 分页查询用户岗位关联 */
  QUERY: 'sysUserPost:query',
  /** 新增用户岗位关联 */
  CREATE: 'sysUserPost:create',
  /** 更新用户岗位关联 */
  UPDATE: 'sysUserPost:update',
  /** 删除用户岗位关联、清空全部 */
  DELETE: 'sysUserPost:delete',
} as const;
