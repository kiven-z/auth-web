import { describe, expect, it } from 'vitest';

import { resolveBooleanI18nLabel, resolveI18nEnumLabel } from '@/shared/utils/i18n-display';

describe('i18n-display', () => {
  const t = (key: string) => (key === 'enum.ACTIVE' ? '启用' : key);

  it('resolveI18nEnumLabel 有翻译时返回文案', () => {
    expect(resolveI18nEnumLabel(t, 'enum', 'ACTIVE')).toBe('启用');
  });

  it('resolveI18nEnumLabel 无翻译时回退原值', () => {
    expect(resolveI18nEnumLabel(t, 'enum', 'UNKNOWN')).toBe('UNKNOWN');
  });

  it('resolveI18nEnumLabel 空值返回空串', () => {
    expect(resolveI18nEnumLabel(t, 'enum', undefined)).toBe('');
  });

  it('resolveBooleanI18nLabel 按布尔解析', () => {
    const boolT = (key: string) => (key === 'on' ? '开' : key === 'off' ? '关' : key);
    expect(resolveBooleanI18nLabel(boolT, true, 'on', 'off')).toBe('开');
    expect(resolveBooleanI18nLabel(boolT, false, 'on', 'off')).toBe('关');
    expect(resolveBooleanI18nLabel(boolT, undefined, 'on', 'off')).toBe('');
  });
});
