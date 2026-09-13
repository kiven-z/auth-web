import type { PageResponse } from '@/api/models/page';
import type {
  FileExportAttempt,
  FileExportTaskAdminDetail,
  FileExportTaskAdminPageQuery,
  FileExportTaskAdminPageRow,
} from '@/features/file/api/models/file-export-task';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 管理端异步导出任务分页查询
 * @param parameters 分页与筛选参数
 * @returns 导出任务分页数据
 */
export function queryAdminFileExportTaskPage(parameters: FileExportTaskAdminPageQuery) {
  return http.get<PageResponse<FileExportTaskAdminPageRow>, AxiosRequestConfig<FileExportTaskAdminPageQuery>>(
    '/system/file/export-tasks/page',
    {
      params: parameters,
    }
  );
}

/**
 * 管理端异步导出任务详情查询
 * @param id 导出任务主键
 * @returns 导出任务详情
 */
export function getAdminFileExportTaskDetail(id: string) {
  return http.get<FileExportTaskAdminDetail, AxiosRequestConfig>(`/system/file/export-tasks/${id}`);
}

/**
 * 管理端查询导出任务执行尝试
 * @param id 导出任务主键
 * @returns 执行尝试列表
 */
export function listAdminFileExportTaskAttempts(id: string) {
  return http.get<FileExportAttempt[], AxiosRequestConfig>(`/system/file/export-tasks/${id}/attempts`);
}

/**
 * 管理端强制取消导出任务
 * @param id 导出任务主键
 * @returns 无返回值
 */
export function forceCancelAdminFileExportTask(id: string) {
  return http.post<void, undefined>(`/system/file/export-tasks/${id}/force-cancel`);
}

/**
 * 管理端强制重试导出任务
 * @param id 导出任务主键
 * @returns 无返回值
 */
export function forceRetryAdminFileExportTask(id: string) {
  return http.post<void, undefined>(`/system/file/export-tasks/${id}/force-retry`);
}
