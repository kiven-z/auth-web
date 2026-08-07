import { applyHydratedUiPreferences } from '@/core/preferences/runtime/apply';
import { hasSessionHydrated, hydrateFromServer, startSync } from '@/core/preferences/persistence/sync';
import { syncSystemThemeFromOs } from '@/core/preferences/runtime/system-theme';
import { ensureAccessTokenReady, resetAccessTokenReady } from '@/core/session/token/accessTokenReady';
import { hydrateUserDisplayProfileOnSession } from '@/core/session/profile/displayProfile';
import { hasAccessToken } from '@/core/session/token/sessionToken';

/** 会话副作用（展示资料 / 偏好）单飞，登出前保持同一 Promise */
let sideEffectsPromise: Promise<void> | null = null;

/**
 * 登录或会话恢复后拉取服务端偏好并开启同步（幂等由调用方守卫）。
 */
async function hydrateUiPreferencesOnSession(): Promise<void> {
  startSync();
  await hydrateFromServer(() => {
    applyHydratedUiPreferences();
    // 服务端可能带回过期的 colorScheme，system 模式下按 OS 再校正一次
    syncSystemThemeFromOs();
  });
}

/**
 * Token 已就绪后灌入展示资料与 UI 偏好（单飞；资料 await，偏好后台）。
 * @returns 资料 hydrate 完成的 Promise（偏好可能仍在进行）
 */
export function hydrateAuthenticatedSessionSideEffects(): Promise<void> {
  if (!hasAccessToken()) {
    return Promise.resolve();
  }
  sideEffectsPromise ??= (async () => {
    await hydrateUserDisplayProfileOnSession().catch(() => undefined);
    if (!hasSessionHydrated()) {
      void hydrateUiPreferencesOnSession().catch(() => undefined);
    }
  })();
  return sideEffectsPromise;
}

/**
 * 已登录场景的会话就绪：恢复 accessToken 并启动副作用 hydrate。
 * 供路由守卫使用；HTTP 层仅调用 {@link ensureAccessTokenReady}。
 * @returns 是否已具备可用 accessToken
 */
export async function ensureAuthenticatedSession(): Promise<boolean> {
  const ready = await ensureAccessTokenReady();
  if (!ready) {
    return false;
  }
  void hydrateAuthenticatedSessionSideEffects();
  return true;
}

/**
 * 重置会话 bootstrap 状态（登出时与资料/偏好重置一并调用）。
 */
export function resetSessionBootstrap(): void {
  resetAccessTokenReady();
  sideEffectsPromise = null;
}
