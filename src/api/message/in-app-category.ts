import type { BaseResponsePageRow, PageResponse, SortSpec } from '@/api/common';
import { http } from '@/core/http';
import type { AxiosRequestConfig } from 'axios';

/**
 * 站内信业务分类分页/列表查询参数
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
  /** 仅查大类 */
  rootOnly?: boolean;
  /** 启用状态 */
  status?: boolean;
}

/** 站内信业务分类列表/分页行 */
export interface InAppMessageCategoryPageRow extends BaseResponsePageRow {
  /** 父分类 ID */
  parentId?: string | null;
  parentCode?: string | null;
  parentName?: string | null;
  code: string;
  name: string;
  sortOrder: number;
  status: boolean;
}

/**
 * 分页查询站内信业务分类
 * @param params 查询参数
 * @returns 分类分页数据
 */
export function getInAppMessageCategoryPage(params: InAppMessageCategoryQuery) {
  return http.get<PageResponse<InAppMessageCategoryPageRow>, AxiosRequestConfig<InAppMessageCategoryQuery>>(
    '/system/message/in-app/categories',
    { params }
  );
}

/**
 * 全量列表
 * @param params 筛选条件
 * @returns 分类列表
 */
export function getInAppMessageCategoryList(params?: InAppMessageCategoryQuery) {
  return http.get<InAppMessageCategoryPageRow[], AxiosRequestConfig<InAppMessageCategoryQuery>>(
    '/system/message/in-app/categories/list',
    { params }
  );
}
