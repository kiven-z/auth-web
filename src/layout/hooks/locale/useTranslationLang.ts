import { localeOptions, type LocaleType } from '@/auth/config/locales';
import { getLocaleSnapshot, patchLocale } from '@/core/preferences/storage';
import { changeDocumentTitle } from '@/layout/composables/useDocumentTitle';
import { useEpThemeStore } from '@/store/modules/app/epTheme';
import { onBeforeMount, type Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

/**
 * 导航栏语言切换；附带语言下拉选中样式与偏好持久化
 * @param menuRef 可选菜单 ref，切换语言后触发 handleResize
 * @returns i18n、translation 与下拉样式
 */
export function useTranslationLang(menuRef?: Ref<{ handleResize?: () => void } | undefined>) {
  const { locale, t } = useI18n();
  const route = useRoute();
  const epThemeStore = useEpThemeStore();

  /**
   * 设置界面语言并持久化
   * @param localeValue 语言代码
   */
  function setLocale(localeValue: LocaleType): void {
    patchLocale({ locale: localeValue });
    locale.value = localeValue;
  }

  /**
   * 切换语言并可选刷新横向菜单尺寸
   * @param localeValue 目标语言
   */
  function translation(localeValue: LocaleType): void {
    setLocale(localeValue);
    menuRef?.value?.handleResize?.();
  }

  /**
   * 语言下拉项选中背景/文字色
   * @param current 当前语言
   * @param target 选项语言
   * @returns 行内样式
   */
  function getDropdownItemStyle(current: string, target: string): Record<string, string> {
    return {
      background: current === target ? epThemeStore.epThemeColor : '',
      color: current === target ? '#f4f4f5' : '#000',
    };
  }

  /**
   * 语言下拉项未选中时的 class
   * @param current 当前语言
   * @param target 选项语言
   * @returns class 字符串
   */
  function getDropdownItemClass(current: string, target: string): string {
    return current === target ? '' : 'dark:hover:text-primary!';
  }

  watch(
    () => locale.value,
    () => {
      changeDocumentTitle(route.meta);
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
    getDropdownItemStyle,
    getDropdownItemClass,
  };
}
