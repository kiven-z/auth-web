import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 角色数据范围类型（库表存储值）
 */
export type RoleScopeType = 'ALL' | 'SELF' | 'DEPT' | 'DEPT_AND_CHILD';

/**
 * 角色数据范围回显
 */
export interface SysRoleScopeVO {
  id?: string;
  roleId: string;
  scopeType: RoleScopeType;
  scopeDeptIds: string[];
  remark?: string | null;
}

/**
 * 查询角色数据范围；未配置时后端返回 null
 * @param roleId 角色 ID
 * @returns 范围配置；未配置为 null
 */
export function getRoleScope(roleId: string): Promise<SysRoleScopeVO | null> {
  return http.get<SysRoleScopeVO | null, unknown>(`/system/role/${roleId}/scope`);
}

/**
 * 角色数据范围保存表单
 */
export interface SysRoleScopeForm {
  scopeType: RoleScopeType;
  scopeDeptIds: string[];
  remark?: string | null;
}

/**
 * 保存角色数据范围（upsert）
 * @param roleId 角色 ID
 * @param data 范围表单
 */
export function upsertRoleScope(roleId: string, data: SysRoleScopeForm): Promise<void> {
  return http.put<void, SysRoleScopeForm>(`/system/role/${roleId}/scope`, {
    data,
  } as AxiosRequestConfig<SysRoleScopeForm>);
}
