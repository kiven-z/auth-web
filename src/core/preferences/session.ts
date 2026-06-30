import { applyHydratedUiPreferences } from './apply';
import { hydrateFromServer, startSync } from './sync';

/**
 * 登录或会话恢复后拉取服务端偏好并开启同步（幂等由调用方守卫）
 */
export async function hydrateUiPreferencesOnSession(): Promise<void> {
  startSync();
  await hydrateFromServer(applyHydratedUiPreferences);
}
