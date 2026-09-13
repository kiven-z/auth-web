import type { GrantSubjectItem } from '@/features/system/api/models/role-grant-subjects';
import { http } from '@/core/http/client';
import type { GrantTableSubjectType } from '@/features/system/api/models/grant-table';

/**
 * 查询角色授权对象种子（Assign 灌种：id + label）
 * @param roleId 角色 ID
 * @param subjectType 主体类型
 * @returns 种子列表；无授权时为空数组
 */
export function getRoleGrantSubjectSeeds(
  roleId: string,
  subjectType: GrantTableSubjectType
) {
  return http.get<GrantSubjectItem[], { subjectType: GrantTableSubjectType }>(
    `/system/role/${roleId}/grant-subjects/ids`,
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
export function putRoleGrantSubjects(roleId: string, data: SysRoleGrantSubjectsForm) {
  return http.put<void, SysRoleGrantSubjectsForm>(`/system/role/${roleId}/grant-subjects`, {
    data,
  });
}
