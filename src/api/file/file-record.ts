import type { BaseResponseDetail, BaseResponsePageRow, PageResponse } from '@/api/common';
import { http } from '@/core/http';
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
 * 文件记录详情
 */
export interface FileRecordDetail extends BaseResponseDetail {
  storagePlatform?: string;
  uploadMode?: string;
  bucket?: string;
  objectKey?: string;
  url?: string;
  accessUrl?: string;
  originalName?: string;
  extension?: string;
  contentType?: string;
  size?: number;
  etag?: string;
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

/**
 * 文件记录详情
 * @param id 文件记录ID
 * @returns 文件记录详情
 */
export function getFileRecordDetail(id: string): Promise<FileRecordDetail> {
  return http.get<FileRecordDetail, AxiosRequestConfig>(`/system/file/${id}`);
}
