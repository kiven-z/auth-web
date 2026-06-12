import type { BaseResponseDetail, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { AxiosRequestConfig } from 'axios';

/**
 * 定时任务分页查询参数（对应后端 SysJobQuery）
 */
export interface SysJobPageQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  jobName?: string;
  jobGroup?: string;
  status?: boolean;
}

/**
 * 定时任务分页行（对应后端 SysJobPageResponse + BaseResponse）
 */
export interface SysJobPageRow extends BaseResponsePageRow {
  jobName: string;
  jobGroup: string;
  jobClass?: string;
  taskType?: string;
  handlerCode?: string;
  invokeTarget?: string;
  cronExpression?: string;
  misfirePolicy?: number;
  concurrent?: boolean;
  startTime?: string;
  endTime?: string;
  status?: boolean;
  jobParams?: string;
  payloadJson?: string;
  remark?: string;
  previousFireTime?: string;
  nextFireTime?: string;
}

/**
 * 定时任务详情（对应后端 SysJobDetailVO）
 */
export interface SysJobDetailRow extends BaseResponseDetail {
  jobName: string;
  jobGroup: string;
  jobClass?: string;
  taskType?: string;
  handlerCode?: string;
  invokeTarget?: string;
  cronExpression?: string;
  misfirePolicy?: number;
  concurrent?: boolean;
  startTime?: string;
  endTime?: string;
  status?: boolean;
  jobParams?: string;
  payloadJson?: string;
  remark?: string;
  previousFireTime?: string;
  nextFireTime?: string;
}

/**
 * 分页查询定时任务
 * @param params 定时任务分页查询参数
 * @returns 定时任务分页行
 */
export function getJobPage(params: SysJobPageQuery): Promise<PageResponse<SysJobPageRow>> {
  return http.get<PageResponse<SysJobPageRow>, AxiosRequestConfig<SysJobPageQuery>>('/system/job', {
    params,
  });
}

/**
 * 定时任务详情
 * @param id 任务主键
 * @returns 任务详情
 */
export function getJobDetail(id: string): Promise<SysJobDetailRow> {
  return http.get<SysJobDetailRow, AxiosRequestConfig>(`/system/job/${id}`);
}
