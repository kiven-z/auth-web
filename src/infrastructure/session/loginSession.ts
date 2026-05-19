import type { UserLoginResponse } from '@/api/auth/types';
import { applyRememberPreferencesFromResponse } from './rememberPreferences';
import { setToken } from './sessionToken';
import type { SessionTokenPayload } from './types';

/**
 * 建立会话时的记住登录选项
 */
export type EstablishSessionRememberOptions = {
  isRemembered: boolean;
};

/**
 * 将登录响应映射为 {@link setToken} 所需载荷（后端 `id` → 会话 `userId`）。
 * @param response 登录响应
 * @returns 会话所需载荷
 */
export function mapLoginResponseToSession(response: UserLoginResponse): SessionTokenPayload {
  return {
    accessToken: response.accessToken,
    expires: response.expires,
    avatar: response.avatar,
    username: response.username,
    nickname: response.nickname ?? '',
    roles: response.roles ?? [],
    permissions: response.permissions ?? [],
    userId: response.id,
  };
}

/**
 * 执行登录请求并建立本地会话（供各登录表单复用）。
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
  setToken(mapLoginResponseToSession(body));
  return body;
}
