import type { FormRules } from 'element-plus';

/**
 * 菜单表单校验（文案走 i18n `menus.rules.*`）
 */
export function createMenuFormRules(t: (key: string) => string): FormRules {
  return {
    menuType: [{ required: true, message: t('menus.rules.menuType'), trigger: 'change' }],
    title: [{ required: true, message: t('menus.rules.title'), trigger: 'blur' }],
    name: [{ required: true, message: t('menus.rules.name'), trigger: 'blur' }],
    path: [{ required: true, message: t('menus.rules.path'), trigger: 'blur' }],
  };
}
