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
 * 变量表转换失败时的 i18n key
 */
export interface RequireFieldsTransformError {
  messageKey: string;
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
    exampleValueJson: JSON.stringify(row.exampleValue),
  }));
}

/**
 * 可编辑表格数据转接口 payload，失败返回 messageKey
 * @param rows 可编辑行
 * @returns 成功 payload 或失败错误
 */
export function toRequireFieldsPayload(rows: EditableRequireFieldRow[]) {
  const keys = rows.map((row) => row.key.trim()).filter(Boolean);
  if (keys.length !== new Set(keys).size) {
    return {
      ok: false as const,
      error: { messageKey: 'messageTemplate.requireFieldKeyDuplicate' } satisfies RequireFieldsTransformError,
    };
  }

  const payload: MessageTemplateRequireFieldRow[] = [];
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) {
      return {
        ok: false as const,
        error: { messageKey: 'messageTemplate.requireFieldKeyRequired' } satisfies RequireFieldsTransformError,
      };
    }

    const raw = row.exampleValueJson?.trim() ?? '';
    if (!raw) {
      return {
        ok: false as const,
        error: { messageKey: 'messageTemplate.requireFieldExampleRequired' } satisfies RequireFieldsTransformError,
      };
    }

    let exampleValue: unknown;
    try {
      exampleValue = JSON.parse(raw);
    } catch {
      exampleValue = raw;
    }

    payload.push({
      key,
      description: row.description?.trim() || undefined,
      exampleValue,
    });
  }

  return { ok: true as const, payload };
}
