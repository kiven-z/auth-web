import { http } from '@/core/http';
import type { BaseResponsePageRow, PageResponse } from '@/api/common';
import type { AxiosRequestConfig } from 'axios';

/**
 * 文件记录分页查询参数
 */
export interface FileRecordPageQuery {
  pageIndex?: number;
  pageSize?: number;
  ownerUserId?: string;
  bizType?: string;
  bizId?: string;
  originalName?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * 文件记录分页行
 */
export interface FileRecordPageRow extends BaseResponsePageRow {
  storagePlatform?: string;
  uploadMode?: string;
  bucket?: string;
  objectKey?: string;
  url?: string;
  accessUrl?: string;
  originalName?: string;
  contentType?: string;
  size?: number;
  bizType?: string;
  bizId?: string;
  remark?: string;
}

/**
 * 文件记录分页查询
 */
export function queryFileRecordPage(params: FileRecordPageQuery): Promise<PageResponse<FileRecordPageRow>> {
  return http.get<PageResponse<FileRecordPageRow>, AxiosRequestConfig<FileRecordPageQuery>>('/system/file/page', {
    params,
  });
}
