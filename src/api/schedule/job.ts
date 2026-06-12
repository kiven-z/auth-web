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
 * 新增定时任务
 * @param data 新增表单数据
 */
export function createJob(data: SysJobCreateForm): Promise<string> {
  return http.post<string, SysJobCreateForm>('/system/job', { data });
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

/**
 * 消息调度 payload 模板
 */
export function getMessagePayloadTemplate(): Promise<Record<string, unknown>> {
  return http.get<Record<string, unknown>, AxiosRequestConfig>('/system/job/catalog/message-payload-template');
}
