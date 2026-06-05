import type { ExportScope } from '@/api/common';

/** 导出弹窗表单状态 */
export interface ExportDialogFormState {
  /** 导出范围 */
  exportScope: ExportScope;
  /** 起始页（仅 PAGE_RANGE） */
  fromPage: number;
  /** 结束页（仅 PAGE_RANGE） */
  toPage: number;
}

/** 导出弹窗面板 props */
export interface ExportDialogPanelProps {
  /** 当前页码（1-based） */
  currentPage: number;
  /** 每页条数 */
  pageSize: number;
  /** 总记录数 */
  total: number;
  /** 单次导出最大行数 */
  maxExportRows?: number;
}

/** 导出弹窗面板对外暴露的方法 */
export interface ExportDialogPanelExpose {
  /** 校验表单 */
  validate: () => Promise<boolean>;
  /** 读取当前表单值 */
  getFormState: () => ExportDialogFormState;
}
