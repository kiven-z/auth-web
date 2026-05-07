/**
 * 定时任务分组 API
 *
 * 对应后端 SysJobGroupController (/api/system/job-group)
 */
import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http';
import type { AxiosRequestConfig } from 'axios';

/** 任务分组分页查询参数（对应后端 SysJobGroupQuery） */
export interface SysJobGroupPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  groupCode?: string;
  groupName?: string;
  status?: number;
}

/** 任务分组分页行（对应后端 SysJobGroupPageResponse） */
export interface SysJobGroupPageRow {
  id: string;
  groupCode: string;
  groupName: string;
  description?: string;
  status: number;
  isSystem: number;
  orderNum: number;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/** 新增任务分组请求体（对应后端 SysJobGroupForm） */
export interface CreateJobGroupRequest {
  groupCode: string;
  groupName: string;
  description?: string;
  status: number;
  orderNum?: number;
}

/** 修改任务分组请求体（对应后端 SysJobGroupUpdateForm，不含 groupCode） */
export interface UpdateJobGroupRequest {
  id: string;
  groupName: string;
  description?: string;
  status: number;
  orderNum: number;
}

/**
 * 分页查询任务分组
 * @param params 查询与分页条件
 */
export function getJobGroupPage(params: SysJobGroupPageQuery): Promise<PageResponse<SysJobGroupPageRow>> {
  return http.get<PageResponse<SysJobGroupPageRow>, AxiosRequestConfig<SysJobGroupPageQuery>>('/system/job-group', {
    params,
  });
}

/**
 * 新增任务分组
 * @param data 新增表单数据
 */
export function createJobGroup(data: CreateJobGroupRequest): Promise<string> {
  return http.post<string, CreateJobGroupRequest>('/system/job-group', { data });
}

/**
 * 修改任务分组
 * @param data 修改表单数据
 */
export function updateJobGroup(data: UpdateJobGroupRequest): Promise<string> {
  data = {
    id: data.id,
    groupName: data.groupName,
    description: data.description,
    status: data.status,
    orderNum: data.orderNum,
  };

  return http.request<string>('put', '/system/job-group', { data });
}

/**
 * 删除任务分组
 * @param id 分组主键
 */
export function deleteJobGroup(id: string): Promise<string> {
  return http.request<string>('delete', `/system/job-group/${id}`);
}
