import type { UserLoginResponse } from '@/api/auth/types';
import { hydrateUiPreferencesOnSession } from '@/core/preferences/session';
import { hasSessionHydrated } from '@/core/preferences/sync';
import { hydrateUserDisplayProfileOnSession } from '@/core/session/displayProfile';
import { applyRememberPreferencesFromResponse } from './rememberPreferences';
import { setToken } from './sessionToken';
import type { SessionTokenPayload } from './types';

/**
 * 建立会话时的记住登录选项
 */
export interface EstablishSessionRememberOptions {
  isRemembered: boolean;
}

/**
 * 执行登录请求并建立本地会话（供各登录表单复用）
 * 鉴权写入 setToken 后 await 展示资料 hydrate，避免顶栏依赖登录体中的展示字段
 * @param fetchLogin 登录请求（请求体应含 rememberMe）
 * @param rememberOptions 记住登录选项
 * @returns 登录响应
 */
export async function establishSessionFromLogin(
  fetchLogin: () => Promise<UserLoginResponse>,
  rememberOptions: EstablishSessionRememberOptions
): Promise<UserLoginResponse> {
  const body = await fetchLogin();
  applyRememberPreferencesFromResponse(rememberOptions.isRemembered, body.readMeDay);

  const sessionPayload: SessionTokenPayload = {
    accessToken: body.accessToken,
    expires: body.expires,
    username: body.username,
    roles: body.roles,
    permissions: body.permissions,
    userId: body.id,
  };
  setToken(sessionPayload);

  await hydrateUserDisplayProfileOnSession().catch(() => undefined);

  if (!hasSessionHydrated()) {
    void hydrateUiPreferencesOnSession().catch(() => undefined);
  }
  return body;
}
