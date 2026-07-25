import { hydrateUiPreferencesOnSession } from '@/core/preferences/session';
import { hasSessionHydrated } from '@/core/preferences/sync';
import { ensureAccessTokenReady, resetAccessTokenReady } from '@/core/session/accessTokenReady';
import { hydrateUserDisplayProfileOnSession } from '@/core/session/displayProfile';
import { hasAccessToken } from '@/core/session/sessionToken';

/** 会话副作用（展示资料 / 偏好）单飞，登出前保持同一 Promise */
let sideEffectsPromise: Promise<void> | null = null;

/**
 * Token 已就绪后灌入展示资料与 UI 偏好（单飞；资料 await，偏好后台）。
 * @returns 资料 hydrate 完成的 Promise（偏好可能仍在进行）
 */
export function hydrateAuthenticatedSessionSideEffects(): Promise<void> {
  if (!hasAccessToken()) {
    return Promise.resolve();
  }
  if (!sideEffectsPromise) {
    sideEffectsPromise = (async () => {
      await hydrateUserDisplayProfileOnSession().catch(() => undefined);
      if (!hasSessionHydrated()) {
        void hydrateUiPreferencesOnSession().catch(() => undefined);
      }
    })();
  }
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
