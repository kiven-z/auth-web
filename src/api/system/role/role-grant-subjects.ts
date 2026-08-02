import type { GrantTableSubjectType } from '@/api/system/_shared/grant-table';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 角色授权对象种子项（勾选回显）
 */
export interface GrantSubjectItem {
  id: string;
  label: string;
}

/**
 * 角色授权对象按主体类型回显
 */
export interface SysRoleGrantSubjects {
  subjectType: GrantTableSubjectType;
  /** 空数组表示该类型无授权 */
  subjects: GrantSubjectItem[];
}

/**
 * 按角色与主体类型查询授权对象
 * @param roleId 角色 ID
 * @param subjectType 主体类型
 * @returns 种子列表；无授权时 subjects 为空
 */
export function getRoleGrantSubjects(
  roleId: string,
  subjectType: GrantTableSubjectType
): Promise<SysRoleGrantSubjects> {
  return http.get<SysRoleGrantSubjects, { subjectType: GrantTableSubjectType }>(
    `/system/role/${roleId}/grant-subjects`,
    { params: { subjectType } }
  );
}

/**
 * 角色授权对象按主体类型覆盖请求
 */
export interface SysRoleGrantSubjectsForm {
  subjectType: GrantTableSubjectType;
  /** 全量替换；空数组表示清空该角色下该类型全部授权 */
  subjectIds: string[];
}

/**
 * 按主体类型覆盖角色授权对象
 * @param roleId 角色 ID
 * @param data 主体类型与 ID 列表
 */
export function putRoleGrantSubjects(roleId: string, data: SysRoleGrantSubjectsForm): Promise<void> {
  return http.put<void, SysRoleGrantSubjectsForm>(`/system/role/${roleId}/grant-subjects`, {
    data,
  } as AxiosRequestConfig<SysRoleGrantSubjectsForm>);
}
