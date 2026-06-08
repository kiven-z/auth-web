import type { AxiosRequestConfig } from 'axios';

import { http } from '@/infrastructure/http-core';

/**
 * 用户档案-部门项（对齐 {@code SysUserDeptProfileItemResponse}）
 */
export interface SysUserDeptProfileItem {
  deptId: string;
  deptName: string;
  deptCode: string;
  isPrimary: boolean;
  status: number;
  position?: string | null;
  joinTime?: string | null;
}

/**
 * 用户档案-岗位项（对齐 {@code SysUserPostProfileItemResponse}）
 */
export interface SysUserPostProfileItem {
  id: string;
  postId: string;
  postName: string;
  postCode: string;
  isPrimary: boolean;
  status: number;
}

/**
 * 用户远程搜索选项（对齐 {@code SysUserSearchItemResponse}）
 */
export interface UserSearchOption {
  id: string;
  username: string;
  nickname?: string | null;
}

/**
 * 用户档案（对齐 {@code SysUserProfileResponse}）
 */
export interface SysUserProfileResponse {
  id: string;
  username: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  status: number;
  gender?: number | null;
  birthday?: string | null;
  introduction?: string | null;
  deptList: SysUserDeptProfileItem[];
  postList: SysUserPostProfileItem[];
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
 * 远程搜索用户（关键词匹配用户名、昵称、邮箱、手机、工号）
 * @param keyword 搜索关键字
 * @param limit 返回条数上限，默认由后端决定（20），最大 50
 * @returns 用户远程搜索选项
 */
export function searchUserByKeyword(keyword: string, limit?: number): Promise<UserSearchOption[]> {
  return http.get<UserSearchOption[], AxiosRequestConfig>('/system/user/search', {
    params: { keyword, ...(limit != null ? { limit } : {}) },
  });
}
