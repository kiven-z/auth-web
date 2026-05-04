import type { AxiosRequestConfig } from 'axios';

import { http } from '@/infrastructure/http';

/** 用户档案-部门项（对齐 {@code SysUserDeptProfileItemResponse}） */
export interface SysUserDeptProfileItem {
  deptId: string;
  deptName: string;
  deptCode: string;
  isPrimary: boolean;
  status: number;
  position?: string | null;
  joinTime?: string | null;
}

/** 用户档案-岗位项（对齐 {@code SysUserPostProfileItemResponse}） */
export interface SysUserPostProfileItem {
  id: string;
  postId: string;
  postName: string;
  postCode: string;
  isPrimary: boolean;
  status: number;
}

/** 用户档案（对齐 {@code SysUserProfileResponse}） */
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
  lastLoginIp?: string | null;
  lastLoginRegion?: string | null;
  lastLoginTime?: string | null;
  deptList: SysUserDeptProfileItem[];
  postList: SysUserPostProfileItem[];
}

/**
 * 查询用户档案（基本信息、部门、岗位）
 * @param userId 用户 ID（字符串化 Long）
 */
export function getUserProfile(userId: string | undefined): Promise<SysUserProfileResponse> {
  return http.get<SysUserProfileResponse, AxiosRequestConfig>(`/system/user/${userId}/profile`);
}
