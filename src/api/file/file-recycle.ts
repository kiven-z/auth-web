import { http } from '@/core/http';
import type { PageResponse } from '@/api/common';
import type { AxiosRequestConfig } from 'axios';
import type { FileRecordPageQuery, FileRecordPageRow } from '@/api/file/file-record';

/**
 * 回收站分页查询
 */
export function getFileRecyclePage(params: FileRecordPageQuery): Promise<PageResponse<FileRecordPageRow>> {
  return http.get<PageResponse<FileRecordPageRow>, AxiosRequestConfig<FileRecordPageQuery>>(
    '/system/file/recycle/page',
    { params }
  );
}

/**
 * 回收站批量恢复
 */
export function restoreFileRecycle(ids: string[]): Promise<void> {
  return http.post<void, string[]>('/system/file/recycle/restore', { data: ids });
}

/**
 * 回收站批量彻底删除
 */
export function purgeFileRecycle(ids: string[]): Promise<void> {
  return http.request<void>('delete', '/system/file/recycle/purge', { data: ids });
}
