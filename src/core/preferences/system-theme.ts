import { applyThemePreferences } from './apply';
import { reconcileNavTheme } from './reconcile-nav-theme';
import { getLayoutSnapshot, patchLayout } from './storage';

let stopWatch: (() => void) | null = null;

/**
 * 在 overallStyle 为 system 时，按 OS 偏好写入 darkMode、校正 theme 并应用到 DOM
 */
export function syncSystemThemeFromOs(): void {
  const snapshot = getLayoutSnapshot();
  if (snapshot.overallStyle !== 'system') {
    return;
  }
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = reconcileNavTheme(snapshot, darkMode);
  patchLayout({ darkMode, theme });
  applyThemePreferences();
}

/**
 * 全局监听 prefers-color-scheme（幂等，重复调用不会叠加监听）
 * @returns 取消监听
 */
export function startSystemThemeWatch(): () => void {
  if (stopWatch) {
    return stopWatch;
  }

  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => syncSystemThemeFromOs();
  mediaQueryList.addEventListener('change', onChange);

  stopWatch = () => {
    mediaQueryList.removeEventListener('change', onChange);
    stopWatch = null;
  };
  return stopWatch;
}
