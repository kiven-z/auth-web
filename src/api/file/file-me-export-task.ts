import type { PageResponse } from '@/api/common/page';
import type {
  FileExportTaskDetail,
  FileExportTaskPageQuery,
  FileExportTaskPageRow,
} from '@/api/file/models/file-export-task.types';
import { http } from '@/core/http/client';
import type { AxiosRequestConfig } from 'axios';

/**
 * 个人异步导出任务分页查询。
 * @param parameters 分页与筛选参数
 * @returns 导出任务分页数据
 */
export function queryPersonalFileExportTaskPage(
  parameters: FileExportTaskPageQuery
): Promise<PageResponse<FileExportTaskPageRow>> {
  return http.get<PageResponse<FileExportTaskPageRow>, AxiosRequestConfig<FileExportTaskPageQuery>>(
    '/system/me/file-export-tasks/page',
    {
      params: parameters,
    }
  );
}

/**
 * 个人异步导出任务详情查询。
 * @param id 导出任务主键
 * @returns 导出任务详情
 */
export function getPersonalFileExportTaskDetail(id: string): Promise<FileExportTaskDetail> {
  return http.get<FileExportTaskDetail, AxiosRequestConfig>(`/system/me/file-export-tasks/${id}`);
}
