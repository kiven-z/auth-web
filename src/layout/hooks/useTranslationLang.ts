import { localeOptions, type LocaleType } from '@/config/locales';
import { onBeforeMount, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useNav } from './useNav';

export function useTranslationLang(ref?: Ref) {
  const { $storage, changeTitle, handleResize } = useNav();
  const { locale, t } = useI18n();
  const route = useRoute();

  function translation(localeValue: LocaleType) {
    $storage.locale = { locale: localeValue };
    locale.value = localeValue;
    ref && handleResize(ref.value);
  }

  watch(
    () => locale.value,
    () => {
      changeTitle(route.meta);
    }
  );

  onBeforeMount(() => {
    locale.value = $storage.locale?.locale ?? 'zh';
  });

  return {
    t,
    route,
    locale,
    translation,
    localeOptions,
  };
}
