import type { BaseResponseDetail, BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/infrastructure/http-core';
import type { SysJobQuartzRuntimeStatus } from '@/views/schedule/schedule-task/constants/job-quartz-runtime-status';
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

/** Quartz 运行时状态查询结果（对应后端 SysJobQuartzRuntimeStatusVO） */
export interface SysJobQuartzRuntimeStatusRow {
  jobName: string;
  jobGroup: string;
  status: SysJobQuartzRuntimeStatus;
  fireTime?: string;
  lastFailedTime?: string;
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
  quartzRuntimeStatus?: SysJobQuartzRuntimeStatus;
  quartzFireTime?: string;
  quartzLastFailedTime?: string;
}

/**
 * 新增定时任务请求体（对应后端 SysJobCreateForm）
 */
export interface SysJobCreateForm {
  jobName: string;
  jobGroup: string;
  jobClass?: string;
  taskType: string;
  handlerCode?: string;
  invokeTarget?: string;
  cronExpression: string;
  misfirePolicy: number;
  concurrent: boolean;
  startTime?: string;
  endTime?: string;
  status: boolean;
  jobParams?: string;
  payloadJson?: string;
  remark?: string;
}

/** 白名单任务类（对应后端 QuartzTaskClassVO） */
export interface QuartzTaskClassRow {
  className: string;
  name: string;
  description?: string;
  invokeModes?: string[];
}

/** 白名单任务类可选方法（对应后端 QuartzTaskMethodVO） */
export interface QuartzTaskMethodRow {
  methodName: string;
  parameterSignature: string;
  returnType: string;
  invokeTargetExample: string;
}

/**
 * 定时任务详情（对应后端 SysJobDetailVO）
 */
export interface SysJobDetailRow extends BaseResponseDetail {
  jobName: string;
  jobGroup: string;
  jobGroupName?: string;
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

/**
 * 修改定时任务请求体（对应后端 SysJobUpdateForm）
 */
export interface SysJobUpdateForm {
  id: string;
  taskType: string;
  cronExpression: string;
  misfirePolicy: number;
  concurrent: boolean;
  startTime?: string;
  endTime?: string;
  status: boolean;
  jobParams?: string;
  handlerCode?: string;
  payloadJson?: string;
  invokeTarget?: string;
  remark?: string;
}

/**
 * 新增定时任务
 * @param data 新增表单数据
 */
export function createJob(data: SysJobCreateForm): Promise<string> {
  return http.post<string, SysJobCreateForm>('/system/job', { data });
}

/**
 * 修改定时任务
 * @param data 修改表单数据
 */
export function updateJob(data: SysJobUpdateForm): Promise<string> {
  return http.request<string>('put', '/system/job', { data });
}

/**
 * 立即执行一次（对应后端 SysJobOperationController.runOnce）
 * @param id 任务主键
 */
export function runJobOnce(id: string): Promise<string> {
  return http.post<string, undefined>(`/system/job/${id}/run`);
}

/**
 * 查询 Quartz 运行时状态（对应后端 SysJobOperationController.runtime）
 * @param jobName 任务名称
 * @param jobGroup 任务分组
 */
export function getJobQuartzRuntimeStatus(jobName: string, jobGroup: string): Promise<SysJobQuartzRuntimeStatusRow> {
  return http.get<SysJobQuartzRuntimeStatusRow, AxiosRequestConfig>('/system/job/runtime', {
    params: { jobName, jobGroup },
  });
}

/**
 * 白名单任务类列表
 */
export function getJobCatalogClasses(): Promise<QuartzTaskClassRow[]> {
  return http.get<QuartzTaskClassRow[], AxiosRequestConfig>('/system/job/catalog/classes');
}

/**
 * 白名单任务类可调用方法列表
 * @param className 类全限定名
 */
export function getJobCatalogMethods(className: string): Promise<QuartzTaskMethodRow[]> {
  return http.get<QuartzTaskMethodRow[], AxiosRequestConfig>('/system/job/catalog/methods', {
    params: { className },
  });
}
