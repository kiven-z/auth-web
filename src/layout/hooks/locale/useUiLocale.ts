import type { LocaleType } from '@/auth/config/locales';
import { patchLocale } from '@/core/preferences';
import { useI18n } from 'vue-i18n';

/**
 * UI 语言偏好写入与 i18n 同步
 * @returns setLocale
 */
export function useUiLocale() {
  const { locale } = useI18n();

  /**
   * 设置界面语言并持久化
   * @param localeValue 语言代码
   */
  function setLocale(localeValue: LocaleType): void {
    patchLocale({ locale: localeValue });
    locale.value = localeValue;
  }

  return {
    setLocale,
  };
}
