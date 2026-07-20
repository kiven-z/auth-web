import type { BaseResponsePageRow, SortSpec } from '@/api/common';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

/**
 * 站内信业务分类查询参数
 */
export interface InAppMessageCategoryQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: SortSpec[];
  /** 分类码 */
  code?: string;
  /** 展示名 */
  name?: string;
  /** 父分类 ID */
  parentId?: string;
  /** true=仅大类；false=仅小类 */
  rootOnly?: boolean;
  /** 启用状态 */
  status?: boolean;
}

/**
 * 站内信业务分类行
 */
export interface InAppMessageCategoryPageRow extends BaseResponsePageRow {
  /** 父分类 ID；大类为 "0" */
  parentId: string;
  parentCode?: string | null;
  parentName?: string | null;
  code: string;
  name: string;
  sortOrder: number;
  status: boolean;
  children?: InAppMessageCategoryPageRow[];
}
/**
 * 全量扁平列表
 * @param params 筛选条件
 * @returns 分类列表
 */
export function getInAppMessageCategoryList(params?: InAppMessageCategoryQuery) {
  return http.get<InAppMessageCategoryPageRow[], AxiosRequestConfig<InAppMessageCategoryQuery>>(
    '/system/message/in-app/categories/list',
    { params }
  );
}
