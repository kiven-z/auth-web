import { responsiveStorageNameSpace } from '@/auth/config';
import { getLocaleDef, locales } from '@/auth/config/locales';
import { storageLocal } from '@/core/storage/storageLocal';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import type { App, WritableComputedRef } from 'vue';
import { createI18n, type I18n } from 'vue-i18n';

/**
 * 扫描子目录（如 zh-CN/buttons.yaml, en/panel.yaml）
 * @returns 国际化配置
 */
const siphonI18n = (function () {
  // 仅初始化一次国际化配置，递归扫描子目录（如 zh-CN/buttons.yaml, en/panel.yaml）
  const cache: Record<string, Record<string, any>> = {};
  const modules = import.meta.glob('../../../locales/**/*.y(a)?ml', { eager: true });

  for (const [filePath, module] of Object.entries(modules)) {
    // 从路径中提取 "locales/" 之后的第一个目录名作为语言标识（支持任意深度嵌套）
    // 例如: "../../../locales/zh-CN/common/buttons.yaml" → "zh-CN"
    const lang = /locales\/([A-Za-z0-9_-]+)\//.exec(filePath)?.[1];
    if (!lang) continue;

    if (!cache[lang]) {
      cache[lang] = {};
    }
    // 深合并：同名根 key（如 menus）可拆到多个文件而不互相覆盖
    if (isObject(module) && 'default' in module) {
      merge(cache[lang], module.default);
    }
  }

  return (prefix = 'zh-CN') => {
    return cache[prefix] ?? {};
  };
})();

const localesConfigs = Object.fromEntries(
  locales.map(({ locale, folder, el }) => [locale, { ...siphonI18n(folder), ...el }])
);

/**
 * 获取对象中所有嵌套对象的key键，并将它们用点号分割组成字符串
 * @param obj 对象
 * @returns 所有嵌套对象的key键
 */
function getObjectKeys(obj) {
  const stack = [];
  const keys: Set<string> = new Set();

  stack.push({ obj, key: '' });

  while (stack.length > 0) {
    const { obj, key } = stack.pop();

    for (const k in obj) {
      const newKey = key ? `${key}.${k}` : k;

      if (obj[k] && isObject(obj[k])) {
        stack.push({ obj: obj[k], key: newKey });
      } else {
        keys.add(key);
      }
    }
  }

  return keys;
}

/**
 * 将展开的key缓存
 * @param prefix 前缀
 * @returns 展开的key缓存
 */
const keysCache: Map<string, Set<string>> = new Map();
const flatI18n = (prefix = 'zh-CN') => {
  let cache = keysCache.get(prefix);
  if (!cache) {
    cache = getObjectKeys(siphonI18n(prefix));
    keysCache.set(prefix, cache);
  }
  return cache;
};

/**
 * 国际化转换工具函数（自动读取根目录locales文件夹下文件进行国际化匹配）
 * @param message message
 * @returns 转化后的message
 */
export function transformI18n(message: any = '') {
  if (!message) {
    return '';
  }

  // 处理存储动态路由的title,格式 {zh:"",en:""}
  if (typeof message === 'object') {
    const locale: string | WritableComputedRef<string> | any = i18n.global.locale;
    return message[locale?.value];
  }

  const key = message.match(/(\S*)\./)?.input;
  const locale: string | WritableComputedRef<string> | any = i18n.global.locale;
  const folder = getLocaleDef(locale?.value).folder;

  if (key && flatI18n(folder).has(key)) {
    return i18n.global.t.call(i18n.global.locale, message);
  } else if (!key && Object.hasOwn(siphonI18n(folder), message)) {
    // 扁平 key（非嵌套）也能命中翻译
    return i18n.global.t.call(i18n.global.locale, message);
  } else {
    return message;
  }
}

/**
 * 仅供 i18n Ally 做键名智能提示，运行时原样返回 key；不用国际化时可删
 * @param key 键
 * @returns 键
 */
export const $t = (key: string) => key;

export const i18n: I18n = createI18n({
  legacy: false,
  locale: storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}locale`)?.locale ?? 'zh',
  fallbackLocale: 'en',
  messages: localesConfigs,
});

export function useI18n(app: App) {
  app.use(i18n);
}
