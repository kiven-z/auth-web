import { getConfig } from '@/auth/config';

/**
 * 应用标题（配置 Title）
 * @returns 标题文案
 */
export function getAppTitle(): string {
  return getConfig()?.Title ?? '';
}

/**
 * 侧栏 / 顶栏 Logo 资源地址
 * @returns logo URL
 */
export function getLogoUrl(): string {
  return new URL('/logo.svg', import.meta.url).href;
}
