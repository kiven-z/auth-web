import { refreshTokenApi, type UserLoginResponse } from '@/api/auth';
import { setToken } from './sessionToken';
import type { SessionTokenPayload } from './types';

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
 * @param fetchLogin 登录请求
 * @returns 登录响应
 */
export async function establishSessionFromLogin(
  fetchLogin: () => Promise<UserLoginResponse>
): Promise<UserLoginResponse> {
  const body = await fetchLogin();
  setToken(mapLoginResponseToSession(body));
  return body;
}

/**
 * 刷新 accessToken；成功时合并写入会话（仅 Token 字段时保留本地用户信息）。
 * @returns 刷新后的响应
 */
export async function refreshAccessToken() {
  const body = await refreshTokenApi();
  setToken({
    accessToken: body.accessToken,
    expires: body.expires,
  });
  return body;
}
