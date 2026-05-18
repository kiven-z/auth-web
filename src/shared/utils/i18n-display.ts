/**
 * 解析 i18n 枚举文案；无翻译时回退为原始值字符串。
 */
export function resolveI18nEnumLabel(
  t: (key: string) => string,
  enumKeyPrefix: string,
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const key = `${enumKeyPrefix}.${value}`;
  const label = t(key);
  return label === key ? String(value) : label;
}

/**
 * 解析布尔值对应的 i18n 文案。
 */
export function resolveBooleanI18nLabel(
  t: (key: string) => string,
  value: boolean | null | undefined,
  trueKey: string,
  falseKey: string
): string {
  if (value === null || value === undefined) {
    return '';
  }
  return value ? t(trueKey) : t(falseKey);
}
