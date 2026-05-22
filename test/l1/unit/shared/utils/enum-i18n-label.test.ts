import { describe, expect, it } from 'vitest';
import { formatBooleanI18nLabel, formatEnumI18nLabel } from '@/shared/utils/enum-i18n-label';

describe('enum-i18n-label', () => {
  const t = (key: string) => (key === 'enum.A' ? '甲' : key);

  it('formatEnumI18nLabel 有翻译时返回文案', () => {
    expect(formatEnumI18nLabel(t, 'enum', 'A')).toBe('甲');
  });

  it('formatEnumI18nLabel 无翻译时回退原值', () => {
    expect(formatEnumI18nLabel(t, 'enum', 'B')).toBe('B');
  });

  it('formatBooleanI18nLabel 按布尔解析', () => {
    const boolT = (key: string) => (key === 'on' ? '开' : key === 'off' ? '关' : key);
    expect(formatBooleanI18nLabel(boolT, true, 'on', 'off')).toBe('开');
    expect(formatBooleanI18nLabel(boolT, false, 'on', 'off')).toBe('关');
    expect(formatBooleanI18nLabel(boolT, undefined, 'on', 'off')).toBe('');
  });
});
