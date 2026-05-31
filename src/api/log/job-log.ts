import type { BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 任务调度日志分页查询参数
 */
export interface JobLogPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 任务 ID（sys_job.id） */
  jobId?: string;
  /** 任务名称（模糊） */
  jobName?: string;
  /** 任务分组（模糊） */
  jobGroup?: string;
  /** 调用目标（模糊） */
  invokeTarget?: string;
  /** 触发类型：SCHEDULE / MANUAL / RETRY */
  triggerType?: string;
  /** 耗时(ms)，精确匹配 */
  elapsedTime?: number;
  /** 执行结果：true=成功，false=失败 */
  status?: boolean;
}

/**
 * 任务调度日志分页行
 */
export interface JobLogPageRow extends BaseResponsePageRow {
  jobId?: string | null;
  jobName?: string | null;
  // 任务分组
  jobGroup?: string | null;
  // 执行时调用目标
  invokeTarget?: string | null;
  triggerType?: string | null;
  status: boolean;
  // 耗时毫秒
  elapsedTime?: number | null;
  // 执行报告
  jobMessage?: string | null;
}

/**
 * 任务调度日志详情
 */
export interface JobLogDetailRow extends BaseResponsePageRow {
  jobId?: string | null;
  jobName?: string | null;
  // 任务分组
  jobGroup?: string | null;
  // 执行时调用目标
  invokeTarget?: string | null;
  triggerType?: string | null;
  jobMessage?: string | null;
  // 执行是否成功(true=成功，false=失败)
  status: boolean;
  // 异常信息
  exceptionInfo?: string | null;
  // 耗时毫秒
  elapsedTime?: number | null;
}

/**
 * 分页查询任务调度日志
 */
export function getJobLogPage(params: JobLogPageQuery): Promise<PageResponse<JobLogPageRow>> {
  return http.get<PageResponse<JobLogPageRow>, AxiosRequestConfig<JobLogPageQuery>>('/system/job-log/page', {
    params,
  });
}

/**
 * 任务调度日志详情
 */
export function getJobLogDetail(id: string): Promise<JobLogDetailRow> {
  return http.get<JobLogDetailRow, AxiosRequestConfig>(`/system/job-log/${id}`);
}

/**
 * 批量物理删除任务调度日志
 */
export function deleteJobLog(ids: string[]): Promise<string> {
  return http.request<string>('delete', '/system/job-log', { data: ids });
}
