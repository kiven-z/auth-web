import type { MessageTemplateRequireFieldRow } from '@/api/message/message-template';

/**
 * 可编辑变量行（表格本地态）
 */
export interface EditableRequireFieldRow {
  _id: number;
  key: string;
  description: string;
  exampleValueJson: string;
}

/**
 * 详情数据转可编辑表格数据
 * @param rows 接口返回的变量声明
 * @returns 可编辑行
 */
export function toEditableRequireFields(rows: MessageTemplateRequireFieldRow[]): EditableRequireFieldRow[] {
  return rows.map((row, index) => ({
    _id: index + 1,
    key: row.key,
    description: row.description ?? '',
    exampleValueJson: JSON.stringify(row.exampleValue ?? ''),
  }));
}

/**
 * 可编辑表格数据转接口 payload（不做业务校验，交给后端）
 * @param rows 可编辑行
 * @returns 变量声明列表
 */
export function toRequireFieldsPayload(rows: EditableRequireFieldRow[]): MessageTemplateRequireFieldRow[] {
  return rows.map((row) => {
    const raw = row.exampleValueJson?.trim() ?? '';
    let exampleValue: unknown = null;
    if (raw) {
      try {
        exampleValue = JSON.parse(raw);
      } catch {
        exampleValue = raw;
      }
    }

    return {
      key: row.key.trim(),
      description: row.description?.trim() || undefined,
      exampleValue,
    };
  });
}
