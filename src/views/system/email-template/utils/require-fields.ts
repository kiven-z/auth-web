import type { EmailTemplateRequireFieldRow } from '@/api/system/email-template';

export interface EditableRequireFieldRow {
  _id: number;
  key: string;
  description: string;
  exampleValueJson: string;
}

export interface RequireFieldsTransformError {
  messageKey: string;
}

/**
 * 详情数据转可编辑表格数据。
 */
export function toEditableRequireFields(rows: EmailTemplateRequireFieldRow[]): EditableRequireFieldRow[] {
  return rows.map((row, index) => ({
    _id: index + 1,
    key: row.key,
    description: row.description ?? '',
    exampleValueJson: JSON.stringify(row.exampleValue),
  }));
}

/**
 * 可编辑表格数据转接口 payload，失败返回 messageKey。
 */
export function toRequireFieldsPayload(rows: EditableRequireFieldRow[]) {
  const keys = rows.map((row) => row.key.trim()).filter(Boolean);
  if (keys.length !== new Set(keys).size) {
    return {
      ok: false as const,
      error: { messageKey: 'emailTemplate.requireFieldKeyDuplicate' } satisfies RequireFieldsTransformError,
    };
  }

  const payload: EmailTemplateRequireFieldRow[] = [];
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) {
      return {
        ok: false as const,
        error: { messageKey: 'emailTemplate.requireFieldKeyRequired' } satisfies RequireFieldsTransformError,
      };
    }
    const raw = row.exampleValueJson?.trim() ?? '';
    if (!raw) {
      return {
        ok: false as const,
        error: { messageKey: 'emailTemplate.requireFieldExampleRequired' } satisfies RequireFieldsTransformError,
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
