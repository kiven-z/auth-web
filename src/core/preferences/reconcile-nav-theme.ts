/**
 * 按实际深浅色与 themeColor 偏好校正导航 theme，避免 theme / themeColor 分叉
 * @param layout 含 theme、themeColor 的 layout 片段
 * @param darkMode 当前是否应按深色渲染（含 system 解析后的结果）
 * @returns 应写入的导航 theme
 */
export function reconcileNavTheme(
  layout: Pick<ResponsiveStorage['layout'], 'theme' | 'themeColor'>,
  darkMode: boolean
): string {
  const theme = layout.theme ?? 'light';

  if (darkMode) {
    return theme === 'light' ? 'default' : theme;
  }

  if (layout.themeColor === 'light') {
    return 'light';
  }

  return theme;
}
