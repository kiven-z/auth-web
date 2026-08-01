import type { AxiosRequestConfig } from 'axios';

import type { BaseResponse } from '@/api/common';
import type {
  PermissionReference,
  RoleReference,
  UserDeptReference,
  UserPostReference,
} from '@/api/system/_shared/grant-table';
import { http } from '@/core/http/client';

export type { UserDeptReference, UserPostReference };

/**
 * 用户档案
 */
export interface SysUserProfileResponse {
  id: string;
  username: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  employeeNo?: string | null;
  avatar?: string | null;
  status: number;
  gender?: number | null;
  birthday?: string | null;
  introduction?: string | null;
  remark?: string | null;
  deptList: UserDeptReference[];
  postList: UserPostReference[];
}

/**
 * 查询用户档案（基本信息、部门、岗位）
 * @param userId 用户 ID（字符串化 Long）
 * @returns 用户档案
 */
export function getUserProfile(userId: string | undefined): Promise<SysUserProfileResponse> {
  return http.get<SysUserProfileResponse, AxiosRequestConfig>(`/system/user/${userId}/profile`);
}

/**
 * 用户详情
 */
export interface SysUserDetail extends BaseResponse {
  username: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  employeeNo?: string | null;
  avatar?: string | null;
  status: number;
  gender?: number | null;
  birthday?: string | null;
  introduction?: string | null;
  remark?: string | null;
  deptList: UserDeptReference[];
  postList: UserPostReference[];
  effectiveRoles: RoleReference[];
  effectivePermissions: PermissionReference[];
}

/**
 * 查询用户详情（档案 + 生效授权 + 审计字段）
 * @param userId 用户 ID（字符串化 Long）
 * @returns 用户详情
 */
export function getUserDetail(userId: string): Promise<SysUserDetail> {
  return http.get<SysUserDetail, AxiosRequestConfig>(`/system/user/${userId}/detail`);
}

/**
 * 用户远程搜索选项
 */
export interface UserSearchOption {
  id: string;
  username: string;
  nickname?: string | null;
}

/**
 * 远程搜索用户
 * @param keyword 搜索关键字
 * @param limit 返回条数上限
 * @returns 用户远程搜索选项
 */
export function searchUserByKeyword(keyword: string, limit?: number): Promise<UserSearchOption[]> {
  return http.get<UserSearchOption[], AxiosRequestConfig>('/system/user/search', {
    params: { keyword, limit },
  });
}
