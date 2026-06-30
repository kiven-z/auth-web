import { applyLayoutPreferences, patchLayout } from '@/core/preferences';
import { setSidebarOpened } from '@/core/preferences/actions';
import { useLayout } from './useLayout';

/**
 * UI 布局模式与侧栏状态写入（经 preferences storage 网关）
 * @returns 布局读写与响应式覆盖
 */
export function useUiLayout() {
  const { layoutTheme, layout } = useLayout();

  /**
   * 设置导航布局模式（vertical / horizontal / mix）
   * @param layoutModel 布局模式
   */
  function setLayoutMode(layoutModel: string): void {
    patchLayout({ layout: layoutModel });
    applyLayoutPreferences();
  }

  /**
   * 响应式容器宽度变化时覆盖布局模式（仅改 storage，不切换 app layout 模式）
   * @param layoutModel 当前应使用的布局
   */
  function setResponsiveLayoutTheme(layoutModel: string): void {
    patchLayout({ layout: layoutModel });
    applyLayoutPreferences();
  }

  return {
    layout,
    layoutTheme,
    setLayoutMode,
    setSidebarOpened,
    setResponsiveLayoutTheme,
  };
}
