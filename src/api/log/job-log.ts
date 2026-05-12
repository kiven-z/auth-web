/**
 * 任务调度日志 API
 *
 * 约定后端 LogJobController：/api/system/job-log（前端 baseURL 已含前缀时路径为 /system/job-log）
 */
import type { PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 任务调度日志分页查询参数
 */
export interface JobLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  // 任务名称（模糊搜索）
  jobName?: string;
  // 任务分组
  jobGroup?: string;
  // 执行状态(0成功 1失败)
  status?: number;
}

/**
 * 任务调度日志分页行
 */
export interface JobLogPageRow {
  id: string;
  // 任务名称
  jobName?: string | null;
  // 任务分组
  jobGroup?: string | null;
  // 执行时调用目标
  invokeTarget?: string | null;
  // 执行状态(0成功 1失败)
  status: number;
  // 耗时毫秒
  elapsedTime?: number | null;
  // 执行报告
  jobMessage?: string | null;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 任务调度日志详情
 */
export interface JobLogDetailRow {
  id: string;
  // 任务名称
  jobName?: string | null;
  // 任务分组 */
  jobGroup?: string | null;
  // 执行时调用目标 */
  invokeTarget?: string | null;
  // 执行报告
  jobMessage?: string | null;
  // 执行状态(0成功 1失败)
  status: number;
  // 异常信息
  exceptionInfo?: string | null;
  // 耗时毫秒
  elapsedTime?: number | null;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
}

/**
 * 分页查询任务调度日志
 * @param params 任务调度日志分页查询参数
 * @returns 任务调度日志分页行
 */
export function getJobLogPage(params: JobLogPageQuery): Promise<PageResponse<JobLogPageRow>> {
  return http.get<PageResponse<JobLogPageRow>, AxiosRequestConfig<JobLogPageQuery>>('/system/job-log', {
    params,
  });
}

/**
 * 任务调度日志详情
 * @param id 任务调度日志ID
 * @returns 任务调度日志详情
 */
export function getJobLogDetail(id: string): Promise<JobLogDetailRow> {
  return http.get<JobLogDetailRow, AxiosRequestConfig>(`/system/job-log/${id}`);
}

/**
 * 批量删除任务调度日志
 * @param ids 任务调度日志ID数组
 * @returns 删除任务调度日志响应
 */
export function deleteJobLog(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/job-log', { data: ids });
}
