import { getConfig } from '@/auth/config';

/**
 * 布局内 el-tooltip / tippy 的 effect
 * @returns light | dark 等配置值，默认 light
 */
export function getMenuTooltipEffect(): string {
  return getConfig()?.TooltipEffect ?? 'light';
}
