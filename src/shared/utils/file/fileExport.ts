import type { ImportRowError } from '@/api/common/import';
import { buildExportFilenameStamp } from '@/shared/utils/date/dateTime';
import * as XLSX from 'xlsx';

// --- Blob download ---

/**
 * 清洗下载文件名（去掉路径分隔与控制字符）
 * @param filename 原始文件名
 * @param fallback 空名时的回退
 * @returns 可安全用于 download 属性的文件名
 */
export function sanitizeDownloadFilename(filename: string | undefined | null, fallback = 'download'): string {
  const trimmed = filename?.trim();
  if (!trimmed) {
    return fallback;
  }
  const cleaned = Array.from(trimmed.replaceAll(/[/\\?%*:|"<>]/g, '_'))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code > 0x1f && code !== 0x7f;
    })
    .join('');
  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * 触发浏览器下载 Blob 文件
 * @param blob 文件内容
 * @param filename 保存文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeDownloadFilename(filename);
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * 拉取远程 URL 并以指定文件名触发下载（用于预签名对象存储地址）
 * @param url 文件地址
 * @param filename 保存文件名
 */
export async function downloadUrlAsFile(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status}`);
  }
  const blob = await response.blob();
  downloadBlob(blob, filename);
}

// --- Excel export ---

/** 导入错误 Excel 列定义 */
export interface ImportErrorExcelColumn {
  /** 表头文案 */
  header: string;
  /** 对应错误行字段 */
  key: keyof ImportRowError;
}

/**
 * 根据模板文件名生成导入错误报告文件名
 * @param templateFilename 模板文件名，如 post_import_template.xlsx
 * @param stamp 时间戳片段，默认当前时刻
 * @returns 错误报告文件名
 */
export function buildImportErrorReportFilename(templateFilename: string, stamp?: string): string {
  const resolvedStamp = stamp ?? buildExportFilenameStamp();
  return templateFilename.replace(/_template\.xlsx$/i, `_import_errors_${resolvedStamp}.xlsx`);
}

/**
 * 将导入行级错误导出为 Excel 并触发浏览器下载
 * @param errors 行级错误列表
 * @param filename 保存文件名
 * @param columns Excel 列定义（表头与字段映射）
 */
export function downloadImportErrorsExcel(
  errors: ImportRowError[],
  filename: string,
  columns: ImportErrorExcelColumn[]
): void {
  const rows = errors.map((error) =>
    columns.reduce<Record<string, string | number>>((row, column) => {
      row[column.header] = error[column.key];
      return row;
    }, {})
  );
  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Errors');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, filename);
}
