import { formatToken, getToken } from '@/infrastructure/session';
import { useUserStoreHook } from '@/store/modules/user';
import type { AxiosInstance } from 'axios';
import type { AuthHttpRequestConfig } from '@/infrastructure/http-core/types.d';

let refreshInFlight: Promise<string> | null = null;

/**
 * 单飞刷新 accessToken：并发场景仅触发一次 refreshToken 请求。
 */
export function refreshAccessTokenSingleFlight(): Promise<string> {
  if (refreshInFlight) {
    return refreshInFlight;
  }
  refreshInFlight = doRefreshAccessToken().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * 刷新后为原请求补齐 Authorization 并重放。
 */
export async function replayRequestWithRefreshedToken(
  instance: AxiosInstance,
  config: AuthHttpRequestConfig
): Promise<unknown> {
  const accessToken = await refreshAccessTokenSingleFlight();
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Authorization'] = formatToken(accessToken);
  return instance.request(config);
}

/**
 * 刷新令牌必须要有 refreshToken
 */
async function doRefreshAccessToken(): Promise<string> {
  const tokenData = getToken();
  if (!tokenData?.refreshToken) {
    throw new Error('Refresh token is missing.');
  }
  await useUserStoreHook().handRefreshToken({ refreshToken: tokenData.refreshToken });
  const nextToken = getToken();
  if (!nextToken?.accessToken) {
    throw new Error('Access token is missing after refresh.');
  }
  return nextToken.accessToken;
}
