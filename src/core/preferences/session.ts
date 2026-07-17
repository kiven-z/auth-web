import { applyHydratedUiPreferences } from './apply';
import { hydrateFromServer, startSync } from './sync';
import { syncSystemThemeFromOs } from './system-theme';

/**
 * 登录或会话恢复后拉取服务端偏好并开启同步（幂等由调用方守卫）
 */
export async function hydrateUiPreferencesOnSession(): Promise<void> {
  startSync();
  await hydrateFromServer(() => {
    applyHydratedUiPreferences();
    // 服务端可能带回过期的 darkMode/theme，system 模式下按 OS 再校正一次
    syncSystemThemeFromOs();
  });
}
