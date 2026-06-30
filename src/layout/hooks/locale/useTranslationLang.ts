import { getLocaleSnapshot } from '@/core/preferences';
import { localeOptions, type LocaleType } from '@/auth/config/locales';
import { onBeforeMount, type Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useNav } from '@/layout/hooks';
import { useUiLocale } from './useUiLocale';

/**
 * 导航栏语言切换（对外保留 translation API，内部经 useUiLocale 写入）
 * @param ref 可选菜单 ref，用于 resize
 * @returns i18n 与 translation
 */
export function useTranslationLang(ref?: Ref) {
  const { changeTitle, handleResize } = useNav();
  const { locale, t } = useI18n();
  const route = useRoute();
  const { setLocale } = useUiLocale();

  function translation(localeValue: LocaleType) {
    setLocale(localeValue);
    ref && handleResize(ref.value);
  }

  watch(
    () => locale.value,
    () => {
      changeTitle(route.meta);
    }
  );

  onBeforeMount(() => {
    locale.value = (getLocaleSnapshot().locale ?? 'zh') as LocaleType;
  });

  return {
    t,
    route,
    locale,
    translation,
    localeOptions,
  };
}
